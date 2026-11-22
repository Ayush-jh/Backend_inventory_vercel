import Donation from '../models/Donation.js';
import Inventory from '../models/Inventory.js';
import Distribution from '../models/Distribution.js';

const toCSV = (rows, headers) => {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const head = headers.map((h) => escape(h.label)).join(',');
  const body = rows
    .map((row) => headers.map((h) => escape(typeof h.value === 'function' ? h.value(row) : row[h.value])).join(','))
    .join('\n');
  return head + '\n' + body;
};

export const donationsReport = async (req, res) => {
  const { from, to } = req.query;
  const q = {};
  if (from || to) {
    q.donationDate = {};
    if (from) q.donationDate.$gte = new Date(from);
    if (to) q.donationDate.$lte = new Date(to);
  }
  const rows = await Donation.find(q).populate('donor', 'name').lean();
  res.json(rows);
};

export const inventoryReport = async (req, res) => res.json(await Inventory.find().lean());
export const distributionsReport = async (req, res) =>
  res.json(
    await Distribution.find()
      .populate('beneficiary', 'name')
      .populate('inventory', 'itemName category')
      .lean()
  );

export const exportCSV = async (req, res) => {
  const { type } = req.params;
  let rows = [];
  let headers = [];
  if (type === 'donations') {
    rows = await Donation.find().populate('donor', 'name').lean();
    headers = [
      { label: 'ID', value: 'donationId' },
      { label: 'Donor', value: (r) => r.donor?.name },
      { label: 'Item', value: 'itemName' },
      { label: 'Category', value: 'category' },
      { label: 'Qty', value: 'quantity' },
      { label: 'Date', value: (r) => new Date(r.donationDate).toISOString().slice(0, 10) }
    ];
  } else if (type === 'inventory') {
    rows = await Inventory.find().lean();
    headers = [
      { label: 'Item', value: 'itemName' },
      { label: 'Category', value: 'category' },
      { label: 'Received', value: 'totalReceived' },
      { label: 'Distributed', value: 'totalDistributed' },
      { label: 'Available', value: 'availableQuantity' }
    ];
  } else if (type === 'distributions') {
    rows = await Distribution.find()
      .populate('beneficiary', 'name')
      .populate('inventory', 'itemName')
      .lean();
    headers = [
      { label: 'Beneficiary', value: (r) => r.beneficiary?.name },
      { label: 'Item', value: (r) => r.inventory?.itemName },
      { label: 'Qty', value: 'quantity' },
      { label: 'Date', value: (r) => new Date(r.distributionDate).toISOString().slice(0, 10) }
    ];
  }
  res.header('Content-Type', 'text/csv');
  res.attachment(`${type}-report.csv`);
  res.send(toCSV(rows, headers));
};