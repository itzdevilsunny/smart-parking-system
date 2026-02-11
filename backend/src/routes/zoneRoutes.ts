import { Router } from 'express';
import { query } from '../config/db';

const router = Router();

// Get all zones
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM parking_zones ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get specific zone
router.get('/:id', async (req, res) => {
    try {
        const result = await query('SELECT * FROM parking_zones WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Zone not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get occupancy
router.get('/:id/occupancy', async (req, res) => {
    try {
        const result = await query('SELECT * FROM live_occupancy WHERE zone_id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Occupancy data not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
