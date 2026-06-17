const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Event = require("../models/Event");
const Seat = require("../models/Seat");
const Reservation = require("../models/Reservation");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { eventId, seatNumbers } = req.body;
    const userId = req.user.id;

    if (!eventId || !seatNumbers || seatNumbers.length === 0) {
      return res.status(400).json({ message: "Missing required fields or empty seats" });
    }

    const seats = await Seat.find({
      eventId: eventId,
      seatNumber: { $in: seatNumbers },
      status: "available",
    });

    if (seats.length !== seatNumbers.length) {
      return res.status(400).json({ message: "One or more seats are not available" });
    }

    await Seat.updateMany(
      { eventId: eventId, seatNumber: { $in: seatNumbers } },
      { $set: { status: "reserved" } }
    );

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const reservation = new Reservation({
      userId,
      eventId,
      seatNumbers,
      expiresAt,
    });
    
    await reservation.save();

    res.json({ message: "Seats reserved temporarily", reservation, expiresAt });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
