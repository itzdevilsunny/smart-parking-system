import { Router } from 'express';
import { query } from '../config/db';

const router = Router();

// Deploy response team
router.post('/deploy', async (req, res) => {
    try {
        const { zone_id, violation_id, team_size } = req.body;

        const result = await query(
            `INSERT INTO response_deployments 
       (zone_id, violation_id, team_size, deployed_by, status)
       VALUES ($1, $2, $3, (SELECT id FROM users LIMIT 1), 'dispatched')
       RETURNING *`,
            [zone_id, violation_id, team_size || 2]
        );

        const deployment = result.rows[0];

        // Emit event
        const io = req.app.get('io');
        if (io) {
            io.emit('team_deployed', {
                ...deployment,
                zone_name: (await query('SELECT name FROM parking_zones WHERE id = $1', [zone_id])).rows[0].name
            });
        }

        res.json(deployment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
