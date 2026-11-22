import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Food",
        "Clothes",
        "Books",
        "Toys",
        "School Supplies",
        "Medicines",
        "Blankets",
        "Other",
      ],
      required: true,
    },
    totalReceived: { type: Number, default: 0 },
    totalDistributed: { type: Number, default: 0 },
    availableQuantity: { type: Number, default: 0 },
    minStockLevel: { type: Number, default: 5 },
    image: String,
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

inventorySchema.index({ itemName: 1, category: 1 }, { unique: true });

inventorySchema.pre("save", function () {
  this.availableQuantity = this.totalReceived - this.totalDistributed;
  this.lastUpdated = Date.now();
});

export default mongoose.model("Inventory", inventorySchema);
