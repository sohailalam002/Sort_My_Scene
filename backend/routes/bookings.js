const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Seat = require("../models/Seat");
const Reservation = require("../models/Reservation");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to book this reservation" });
    }

    if (new Date() > reservation.expiresAt) {
      await Seat.updateMany(
        { eventId: reservation.eventId, seatNumber: { $in: reservation.seatNumbers } },
        { $set: { status: "available" } }
      );
      await Reservation.findByIdAndDelete(reservationId);
      return res.status(400).json({ message: "Reservation expired. Seats released." });
    }

    await Seat.updateMany(
      { eventId: reservation.eventId, seatNumber: { $in: reservation.seatNumbers } },
      { $set: { status: "booked" } }
    );

    await Reservation.findByIdAndDelete(reservationId);

    res.json({ message: "Booking confirmed!", seatNumbers: reservation.seatNumbers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
