import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Donor from '../models/Donor.js';
import Donation from '../models/Donation.js';
import Inventory from '../models/Inventory.js';
import Beneficiary from '../models/Beneficiary.js';
import Distribution from '../models/Distribution.js';

dotenv.config();
await connectDB();

await User.deleteMany();
await Donor.deleteMany();
await Donation.deleteMany();
await Inventory.deleteMany();
await Beneficiary.deleteMany();
await Distribution.deleteMany();

await User.create({ name: 'Admin', email: 'admin@ngo.com', password: 'admin123', role: 'admin' });
await User.create({ name: 'Staff', email: 'staff@ngo.com', password: 'staff123', role: 'staff' });

const donors = await Donor.insertMany([
  { name: 'John Smith', email: 'john@example.com', phone: '1234567890', type: 'Individual' },
  { name: 'Helping Hands Org', email: 'help@org.com', phone: '0987654321', type: 'Organization' },
  { name: 'Maria Garcia', email: 'maria@example.com', phone: '5551112222', type: 'Individual' }
]);

const today = new Date();
const monthsAgo = (n) => new Date(today.getFullYear(), today.getMonth() - n, 15);

const donations = await Donation.insertMany([
  { donor: donors[0]._id, itemName: 'Rice Bags', category: 'Food', quantity: 50, condition: 'New', donationDate: monthsAgo(0) },
  { donor: donors[1]._id, itemName: 'Winter Jackets', category: 'Clothes', quantity: 30, condition: 'New', donationDate: monthsAgo(1) },
  { donor: donors[2]._id, itemName: 'Story Books', category: 'Books', quantity: 100, condition: 'Good', donationDate: monthsAgo(1) },
  { donor: donors[0]._id, itemName: 'Notebooks', category: 'School Supplies', quantity: 200, condition: 'New', donationDate: monthsAgo(2) },
  { donor: donors[1]._id, itemName: 'Teddy Bears', category: 'Toys', quantity: 40, condition: 'Good', donationDate: monthsAgo(2) },
  { donor: donors[2]._id, itemName: 'Blankets', category: 'Blankets', quantity: 60, condition: 'New', donationDate: monthsAgo(3) }
]);

const invMap = {};
for (const d of donations) {
  const key = `${d.itemName}|${d.category}`;
  if (!invMap[key]) {
    invMap[key] = new Inventory({
      itemName: d.itemName,
      category: d.category,
      totalReceived: d.quantity,
      minStockLevel: 10
    });
  } else {
    invMap[key].totalReceived += d.quantity;
  }
}
const inventories = await Inventory.insertMany(Object.values(invMap));

const beneficiaries = await Beneficiary.insertMany([
  { name: 'Aisha Khan', age: 8, gender: 'Female', guardianName: 'Fatima Khan', contact: '1112223333', address: 'Sector 5', requiredItems: ['Books', 'Clothes'] },
  { name: 'Rahul Verma', age: 10, gender: 'Male', guardianName: 'Suresh Verma', contact: '2223334444', address: 'Sector 7', requiredItems: ['School Supplies'] },
  { name: 'Sara Ahmed', age: 7, gender: 'Female', guardianName: 'Ali Ahmed', contact: '3334445555', address: 'Sector 2', requiredItems: ['Toys'] },
  { name: 'David Lee', age: 9, gender: 'Male', guardianName: 'Grace Lee', contact: '4445556666', address: 'Sector 9', requiredItems: ['Food', 'Blankets'] }
]);

// Sample distributions
const inv1 = inventories.find((i) => i.itemName === 'Rice Bags');
const inv2 = inventories.find((i) => i.itemName === 'Story Books');

await Distribution.create({ beneficiary: beneficiaries[0]._id, inventory: inv1._id, quantity: 5 });
await Distribution.create({ beneficiary: beneficiaries[1]._id, inventory: inv2._id, quantity: 10 });

// Update inventory with distributed totals
inv1.totalDistributed = 5;
inv2.totalDistributed = 10;
await inv1.save();
await inv2.save();

console.log('✅ Seed complete');
console.log('Admin: admin@ngo.com / admin123');
console.log('Staff: staff@ngo.com / staff123');
await mongoose.connection.close();
process.exit(0);