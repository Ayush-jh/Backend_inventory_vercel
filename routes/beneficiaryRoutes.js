// beneficiaryRoutes.js
import express from 'express';
import * as c from '../controllers/beneficiaryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';
const r = express.Router();
r.route('/')
  .get(protect, c.getBeneficiaries)
  .post(protect, upload.single('photograph'), c.createBeneficiary);
r.route('/:id')
  .get(protect, c.getBeneficiary)
  .put(protect, upload.single('photograph'), c.updateBeneficiary)
  .delete(protect, c.deleteBeneficiary);
export default r;