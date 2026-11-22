import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    guardianName: String,
    contact: String,
    address: String,
    requiredItems: [String],
    registrationDate: { type: Date, default: Date.now },
    photograph: String
  },
  { timestamps: true }
);

export default mongoose.model('Beneficiary', beneficiarySchema);