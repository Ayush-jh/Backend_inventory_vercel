import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: String,
    type: {
      type: String,
      enum: ["Individual", "Organization"],
      default: "Individual",
    },
    registrationDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("Donor", donorSchema);
