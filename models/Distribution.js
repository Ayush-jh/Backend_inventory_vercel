import mongoose from 'mongoose';

const distributionSchema = new mongoose.Schema(
  {
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary', required: true },
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
    quantity: { type: Number, required: true, min: 1 },
    distributionDate: { type: Date, default: Date.now },
    remarks: String
  },
  { timestamps: true }
);

export default mongoose.model('Distribution', distributionSchema);