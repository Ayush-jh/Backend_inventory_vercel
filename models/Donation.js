import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donationId: { type: String, unique: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
    itemName: { type: String, required: true },
    category: {
      type: String,
      enum: ['Food', 'Clothes', 'Books', 'Toys', 'School Supplies', 'Medicines', 'Blankets', 'Other'],
      required: true
    },
    quantity: { type: Number, required: true, min: 1 },
    condition: { type: String, enum: ['New', 'Good', 'Used'], default: 'Good' },
    donationDate: { type: Date, default: Date.now },
    description: String,
    image: String
  },
  { timestamps: true }
);

donationSchema.pre('save', function () {
  if (!this.donationId) {
    this.donationId = 'DON-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
});

export default mongoose.model('Donation', donationSchema);