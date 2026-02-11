-- =====================================================
-- Smart Parking Capacity Enforcement System
-- PostgreSQL Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'officer', 'contractor')),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. PARKING ZONES
-- =====================================================

CREATE TABLE parking_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location_name VARCHAR(255),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    max_capacity INTEGER NOT NULL,
    reserved_slots INTEGER DEFAULT 0,
    contractor_id UUID REFERENCES users(id),
    grace_threshold INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'locked', 'maintenance')),
    fine_per_excess INTEGER DEFAULT 500,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. LIVE OCCUPANCY (Real-time tracking)
-- =====================================================

CREATE TABLE live_occupancy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES parking_zones(id) ON DELETE CASCADE UNIQUE,
    current_count INTEGER DEFAULT 0,
    reserved_count INTEGER DEFAULT 0,
    last_vehicle_in TIMESTAMP,
    last_vehicle_out TIMESTAMP,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. VEHICLE EVENTS (All in/out events)
-- =====================================================

CREATE TABLE vehicle_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES parking_zones(id),
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('vehicle_in', 'vehicle_out')),
    camera_id VARCHAR(100),
    confidence_score DECIMAL(3, 2),
    vehicle_type VARCHAR(50),
    detected_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. VIOLATIONS (Breach records)
-- =====================================================

CREATE TABLE violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES parking_zones(id),
    excess_count INTEGER NOT NULL,
    fine_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'cancelled')),
    challan_number VARCHAR(100) UNIQUE,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    detected_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    notes TEXT
);

-- =====================================================
-- 6. REVENUE LOGS
-- =====================================================

CREATE TABLE revenue_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    zone_id UUID REFERENCES parking_zones(id),
    amount DECIMAL(12, 2) NOT NULL,
    source VARCHAR(50) DEFAULT 'violation',
    transaction_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 7. SYSTEM HEALTH (Monitoring)
-- =====================================================

CREATE TABLE system_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uptime_percentage DECIMAL(5, 2) DEFAULT 99.9,
    ai_status VARCHAR(50) DEFAULT 'offline' CHECK (ai_status IN ('online', 'offline', 'degraded')),
    total_zones_active INTEGER DEFAULT 0,
    total_violations_today INTEGER DEFAULT 0,
    last_sync TIMESTAMP DEFAULT NOW(),
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 8. AUDIT LOGS (Blockchain-ready)
-- =====================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    user_id UUID REFERENCES users(id),
    data JSONB,
    hash_reference VARCHAR(255),
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 9. RESPONSE TEAMS (Deployment tracking)
-- =====================================================

CREATE TABLE response_deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES parking_zones(id),
    violation_id UUID REFERENCES violations(id),
    deployed_by UUID REFERENCES users(id),
    team_size INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'dispatched' CHECK (status IN ('dispatched', 'arrived', 'resolved', 'cancelled')),
    deployed_at TIMESTAMP DEFAULT NOW(),
    arrived_at TIMESTAMP,
    resolved_at TIMESTAMP,
    notes TEXT
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_vehicle_events_zone_time ON vehicle_events(zone_id, detected_at DESC);
CREATE INDEX idx_violations_zone_status ON violations(zone_id, status);
CREATE INDEX idx_violations_detected ON violations(detected_at DESC);
CREATE INDEX idx_revenue_date_zone ON revenue_logs(date DESC, zone_id);
CREATE INDEX idx_occupancy_zone ON live_occupancy(zone_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_response_zone ON response_deployments(zone_id, status);

-- =====================================================
-- VIEWS FOR DASHBOARD
-- =====================================================

-- Dashboard KPIs
CREATE OR REPLACE VIEW dashboard_kpis AS
SELECT
    (SELECT COUNT(*) FROM violations WHERE status = 'pending' AND DATE(detected_at) = CURRENT_DATE) as active_breaches,
    (SELECT COALESCE(SUM(amount), 0) FROM revenue_logs WHERE date = CURRENT_DATE) as revenue_today,
    (SELECT COUNT(*) FROM parking_zones WHERE status = 'active') as active_zones,
    (SELECT COALESCE(SUM(current_count), 0) FROM live_occupancy) as total_vehicles,
    (SELECT uptime_percentage FROM system_health ORDER BY recorded_at DESC LIMIT 1) as system_uptime,
    (SELECT ai_status FROM system_health ORDER BY recorded_at DESC LIMIT 1) as ai_status;

-- Zone Summary
CREATE OR REPLACE VIEW zone_summary AS
SELECT
    z.id,
    z.name,
    z.location_name,
    z.max_capacity,
    z.reserved_slots,
    z.status,
    COALESCE(o.current_count, 0) as current_count,
    COALESCE(o.reserved_count, 0) as reserved_count,
    CASE
        WHEN COALESCE(o.current_count, 0) > z.max_capacity + z.grace_threshold THEN 'over_capacity'
        WHEN COALESCE(o.current_count, 0) > z.max_capacity * 0.9 THEN 'near_capacity'
        ELSE 'normal'
    END as capacity_status,
    o.last_updated
FROM parking_zones z
LEFT JOIN live_occupancy o ON z.id = o.zone_id
WHERE z.status = 'active';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp on user update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON parking_zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL SYSTEM HEALTH RECORD
-- =====================================================

INSERT INTO system_health (uptime_percentage, ai_status, total_zones_active)
VALUES (99.9, 'offline', 0);
