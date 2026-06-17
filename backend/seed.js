require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Event = require("./models/Event");
const Seat = require("./models/Seat");
const Reservation = require("./models/Reservation");

const seedDatabase = async () => {
  try {
    await connectDB();

    await Event.deleteMany({});
    await Seat.deleteMany({});
    await Reservation.deleteMany({});

    const events = [
      {
        name: "Coldplay Concert",
        venue: "DY Patil Stadium",
        dateTime: new Date("2025-08-10T19:00:00"),
        totalSeats: 20,
      },
      {
        name: "Tech Summit 2025",
        venue: "HICC Hyderabad",
        dateTime: new Date("2025-09-15T10:00:00"),
        totalSeats: 15,
      },
    ];

    const insertedEvents = await Event.insertMany(events);

    for (let i = 0; i < insertedEvents.length; i++) {
      const event = insertedEvents[i];
      const seats = [];
      for (let j = 1; j <= event.totalSeats; j++) {
        seats.push({
          eventId: event._id,
          seatNumber: j,
          status: "available",
        });
      }
      await Seat.insertMany(seats);
    }

    console.log("Seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
