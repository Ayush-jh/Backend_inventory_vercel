// donationRoutes.js
import express from 'express';
import * as c from '../controllers/donationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';
const r = express.Router();
r.route('/')
  .get(protect, c.getDonations)
  .post(protect, upload.single('image'), c.createDonation);
r.route('/:id')
  .put(protect, upload.single('image'), c.updateDonation)
  .delete(protect, c.deleteDonation);
export default r;