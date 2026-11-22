// reportRoutes.js
import express from 'express';
import * as c from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = express.Router();
r.get('/donations', protect, c.donationsReport);
r.get('/inventory', protect, c.inventoryReport);
r.get('/distributions', protect, c.distributionsReport);
r.get('/export/:type', protect, c.exportCSV);
export default r;