# SortMyScene - Event Ticket Booking System

A complete MERN stack event ticket booking application with double booking prevention and reservation timers.

## How to Run

### Backend
  cd backend
  npm install
  # Create .env with PORT, MONGO_URI, JWT_SECRET
  node seed.js      # Seed demo data
  npm run dev       # Runs on port 5000

### Frontend
  cd frontend
  npm install
  # Create .env with VITE_API_URL=http://localhost:5000
  npm run dev       # Runs on port 5173

## Important Note - MongoDB Transactions
Transactions require a MongoDB Replica Set.
Option 1: Use MongoDB Atlas (free tier, replica set by default) - RECOMMENDED
Option 2: Run local replica set:
  In mongod.conf add:
    replication:
      replSetName: "rs0"
  Then in mongo shell: rs.initiate()

## Assumptions
- User data stored in-memory (no separate User collection needed for this task)
- MongoDB Atlas recommended for transactions support

## Design Decisions

### Double Booking Prevention
MongoDB transactions used (startSession + startTransaction).
Seats checked atomically within transaction before marking reserved.
If any seat unavailable: entire transaction aborts, no partial reservation happens.

### Reservation Expiry
expiresAt = Date.now() + 10 minutes set on server at reservation time.
On booking attempt, server compares current time with expiresAt.
If expired: seats released back to available, reservation deleted, error returned.
Frontend countdown timer also warns user in real time.

### Auth
JWT-based. Token stored in localStorage.
Sent on every API request via axios interceptor as Authorization: Bearer token.
All reserve and booking routes protected by auth middleware.
