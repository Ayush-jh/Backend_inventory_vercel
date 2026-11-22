import Inventory from '../models/Inventory.js';

export const getInventory = async (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;
  const q = {};
  if (search) q.itemName = new RegExp(search, 'i');
  if (category) q.category = category;

  const total = await Inventory.countDocuments(q);
  const items = await Inventory.find(q)
    .sort({ lastUpdated: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
};

export const getLowStock = async (req, res) => {
  const items = await Inventory.find({ $expr: { $lte: ['$availableQuantity', '$minStockLevel'] } });
  res.json(items);
};

export const getInventoryById = async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const updateInventory = async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
};