const mongoose = require("mongoose");

const solarData = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // date: {
    //   type: Date,
    //   required: true,
    // },
    production: {
      type: Number,
      required: true,
      default: 0,
    },
    consumption: {
      type: Number,
      required: true,
      default: 0,
    },
    batteryLevel: { type: Number, default: 100 },
  },
  { timestamps: true }
);

solarData.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("EnergyData", solarData);
