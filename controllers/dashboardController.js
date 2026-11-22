import Donation from '../models/Donation.js';
import Donor from '../models/Donor.js';
import Inventory from '../models/Inventory.js';
import Beneficiary from '../models/Beneficiary.js';
import Distribution from '../models/Distribution.js';

export const getStats = async (req, res) => {
  const [totalDonations, totalDonors, totalBeneficiaries, distributions, inventories] = await Promise.all([
    Donation.countDocuments(),
    Donor.countDocuments(),
    Beneficiary.countDocuments(),
    Distribution.find(),
    Inventory.find()
  ]);

  const totalItemsReceived = inventories.reduce((s, i) => s + i.totalReceived, 0);
  const availableStock = inventories.reduce((s, i) => s + i.availableQuantity, 0);
  const distributedItems = distributions.reduce((s, d) => s + d.quantity, 0);
  const lowStockCount = inventories.filter((i) => i.availableQuantity <= i.minStockLevel).length;

  res.json({
    totalDonations,
    totalDonors,
    totalBeneficiaries,
    totalItemsReceived,
    availableStock,
    distributedItems,
    lowStockCount
  });
};

export const getCharts = async (req, res) => {
  const monthly = await Donation.aggregate([
    {
      $group: {
        _id: { y: { $year: '$donationDate' }, m: { $month: '$donationDate' } },
        total: { $sum: '$quantity' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.y': 1, '_id.m': 1 } }
  ]);

  const category = await Donation.aggregate([
    { $group: { _id: '$category', total: { $sum: '$quantity' } } }
  ]);

  const monthlyData = monthly.map((m) => ({
    month: `${m._id.y}-${String(m._id.m).padStart(2, '0')}`,
    total: m.total,
    count: m.count
  }));

  res.json({
    monthly: monthlyData,
    category: category.map((c) => ({ name: c._id, value: c.total }))
  });
};