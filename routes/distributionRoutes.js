// distributionRoutes.js
import express from 'express';
import * as c from '../controllers/distributionController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = express.Router();
r.route('/').get(protect, c.getDistributions).post(protect, c.createDistribution);
r.get('/:id', protect, c.getDistribution);
export default r;