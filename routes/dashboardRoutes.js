// dashboardRoutes.js
import express from 'express';
import * as c from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = express.Router();
r.get('/stats', protect, c.getStats);
r.get('/charts', protect, c.getCharts);
export default r;