import { Router } from 'express';
import { query } from '../config/db';

const router = Router();

// Get Dashboard KPIs
router.get('/kpis', async (req, res) => {
    try {
        const result = await query('SELECT * FROM dashboard_kpis');
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Live Zone Data
router.get('/zones/live', async (req, res) => {
    try {
        const result = await query('SELECT * FROM zone_summary');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Active Violations
router.get('/violations/active', async (req, res) => {
    try {
        const result = await query(`
      SELECT v.*, z.name as zone_name 
      FROM violations v 
      JOIN parking_zones z ON v.zone_id = z.id 
      WHERE v.status = 'pending'
      ORDER BY v.detected_at DESC
      LIMIT 10
    `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
