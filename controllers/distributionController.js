import Distribution from '../models/Distribution.js';
import Inventory from '../models/Inventory.js';

export const getDistributions = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const q = {};
  const total = await Distribution.countDocuments(q);
  let distributions = await Distribution.find(q)
    .populate('beneficiary', 'name age gender')
    .populate('inventory', 'itemName category')
    .sort({ distributionDate: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (search) {
    const s = search.toLowerCase();
    distributions = distributions.filter(
      (d) =>
        d.beneficiary?.name.toLowerCase().includes(s) ||
        d.inventory?.itemName.toLowerCase().includes(s)
    );
  }

  res.json({ distributions, total, page: Number(page), pages: Math.ceil(total / limit) });
};

export const createDistribution = async (req, res) => {
  try {
    const { beneficiary, inventory, quantity, distributionDate, remarks } = req.body;

    const inv = await Inventory.findById(inventory);
    if (!inv) return res.status(404).json({ message: 'Inventory item not found' });
    if (quantity > inv.availableQuantity)
      return res.status(400).json({ message: `Insufficient stock. Available: ${inv.availableQuantity}` });

    inv.totalDistributed += Number(quantity);
    await inv.save();

    const dist = await Distribution.create({
      beneficiary,
      inventory,
      quantity,
      distributionDate,
      remarks
    });

    res.status(201).json(dist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getDistribution = async (req, res) => {
  const d = await Distribution.findById(req.params.id)
    .populate('beneficiary')
    .populate('inventory');
  if (!d) return res.status(404).json({ message: 'Not found' });
  res.json(d);
};