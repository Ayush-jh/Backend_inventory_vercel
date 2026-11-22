// donorRoutes.js
import express from 'express';
import * as c from '../controllers/donorController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = express.Router();
r.route('/').get(protect, c.getDonors).post(protect, c.createDonor);
r.route('/:id').put(protect, c.updateDonor).delete(protect, c.deleteDonor);
r.get('/:id/history', protect, c.getDonorHistory);
export default r;