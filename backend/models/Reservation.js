const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  seatNumbers: [{ type: Number }],
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("Reservation", reservationSchema);
