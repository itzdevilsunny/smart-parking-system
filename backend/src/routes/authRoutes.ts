import { Router } from 'express';
import { query } from '../config/db';

const router = Router();

// Login (Mock implementation for prototype)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // HARDCODED DEMO CREDENTIALS (Bypass DB for reliability in demo)
    if (email === 'admin' || email === 'admin@mcd.gov.in') {
        return res.json({
            token: 'mock-token-admin',
            user: { id: 'u1', username: 'Administrator', email: 'admin@mcd.gov.in', role: 'admin', department: 'IT' }
        });
    }
    if (email === 'officer' || email === 'officer@mcd.gov.in') {
        return res.json({
            token: 'mock-token-officer',
            user: { id: 'u2', username: 'Rajesh Kumar', email: 'officer@mcd.gov.in', role: 'officer', department: 'Enforcement' }
        });
    }
    if (email === 'vendor' || email === 'contractor' || email === 'vendor@mcd.gov.in') {
        return res.json({
            token: 'mock-token-vendor',
            user: { id: 'u3', username: 'SecurePark Ltd', email: 'vendor@mcd.gov.in', role: 'contractor', department: 'Operations' }
        });
    }

    // In production, use bcrypt.compare here
    try {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Mock token generation
        const token = 'mock-jwt-token-xyz-123';

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', async (req, res) => {
    // Mock current user
    res.json({
        id: 'admin-id',
        username: 'admin',
        email: 'admin@mcd.gov.in',
        role: 'admin',
        department: 'Infrastructure'
    });
});

export default router;
