const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  seatNumber: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["available", "reserved", "booked"], 
    default: "available" 
  },
});

module.exports = mongoose.model("Seat", seatSchema);
