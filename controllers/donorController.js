import Donor from '../models/Donor.js';
import Donation from '../models/Donation.js';

export const getDonors = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const q = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
  const total = await Donor.countDocuments(q);
  const donors = await Donor.find(q)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ donors, total, page: Number(page), pages: Math.ceil(total / limit) });
};

export const createDonor = async (req, res) => {
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateDonor = async (req, res) => {
  const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!donor) return res.status(404).json({ message: 'Donor not found' });
  res.json(donor);
};

export const deleteDonor = async (req, res) => {
  const donor = await Donor.findByIdAndDelete(req.params.id);
  if (!donor) return res.status(404).json({ message: 'Donor not found' });
  res.json({ message: 'Donor deleted' });
};

export const getDonorHistory = async (req, res) => {
  const donations = await Donation.find({ donor: req.params.id }).sort({ donationDate: -1 });
  res.json(donations);
};