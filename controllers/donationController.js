import Donation from '../models/Donation.js';
import Inventory from '../models/Inventory.js';

export const getDonations = async (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;
  const q = {};
  if (search) q.itemName = new RegExp(search, 'i');
  if (category) q.category = category;

  const total = await Donation.countDocuments(q);
  const donations = await Donation.find(q)
    .populate('donor', 'name email')
    .sort({ donationDate: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ donations, total, page: Number(page), pages: Math.ceil(total / limit) });
};

const upsertInventory = async (donation) => {
  let inv = await Inventory.findOne({ itemName: donation.itemName, category: donation.category });
  if (!inv) {
    inv = new Inventory({
      itemName: donation.itemName,
      category: donation.category,
      totalReceived: donation.quantity,
      image: donation.image
    });
  } else {
    inv.totalReceived += donation.quantity;
    if (donation.image) inv.image = donation.image;
  }
  await inv.save();
};

export const createDonation = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const donation = await Donation.create(data);
    await upsertInventory(donation);
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateDonation = async (req, res) => {
  try {
    const old = await Donation.findById(req.params.id);
    if (!old) return res.status(404).json({ message: 'Not found' });

    // roll back old inventory
    const oldInv = await Inventory.findOne({ itemName: old.itemName, category: old.category });
    if (oldInv) {
      oldInv.totalReceived -= old.quantity;
      await oldInv.save();
    }

    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const updated = await Donation.findByIdAndUpdate(req.params.id, data, { new: true });
    await upsertInventory(updated);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteDonation = async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) return res.status(404).json({ message: 'Not found' });

  const inv = await Inventory.findOne({ itemName: donation.itemName, category: donation.category });
  if (inv) {
    inv.totalReceived -= donation.quantity;
    await inv.save();
  }
  await donation.deleteOne();
  res.json({ message: 'Donation deleted' });
};