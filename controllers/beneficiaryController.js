import Beneficiary from '../models/Beneficiary.js';

export const getBeneficiaries = async (req, res) => {
  const { search, page = 1, limit = 12 } = req.query;
  const q = search ? { name: new RegExp(search, 'i') } : {};
  const total = await Beneficiary.countDocuments(q);
  const beneficiaries = await Beneficiary.find(q)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ beneficiaries, total, page: Number(page), pages: Math.ceil(total / limit) });
};

export const getBeneficiary = async (req, res) => {
  const b = await Beneficiary.findById(req.params.id);
  if (!b) return res.status(404).json({ message: 'Not found' });
  res.json(b);
};

export const createBeneficiary = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.requiredItems === 'string')
      data.requiredItems = data.requiredItems.split(',').map((s) => s.trim()).filter(Boolean);
    if (req.file) data.photograph = `/uploads/${req.file.filename}`;
    const b = await Beneficiary.create(data);
    res.status(201).json(b);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBeneficiary = async (req, res) => {
  const data = { ...req.body };
  if (typeof data.requiredItems === 'string')
    data.requiredItems = data.requiredItems.split(',').map((s) => s.trim()).filter(Boolean);
  if (req.file) data.photograph = `/uploads/${req.file.filename}`;
  const b = await Beneficiary.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json(b);
};

export const deleteBeneficiary = async (req, res) => {
  await Beneficiary.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};