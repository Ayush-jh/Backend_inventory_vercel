// inventoryRoutes.js
import express from 'express';
import * as c from '../controllers/inventoryController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = express.Router();
r.get('/', protect, c.getInventory);
r.get('/low-stock', protect, c.getLowStock);
r.get('/:id', protect, c.getInventoryById);
r.put('/:id', protect, c.updateInventory);
export default r;