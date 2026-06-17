import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CountdownTimer from "../components/CountdownTimer";

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    try {
      const res = await axios.get(`/api/events/${id}`);
      setEvent(res.data.event);
      setSeats(res.data.seats);
    } catch (err) {
      setMessage("Failed to load event details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchEvent();
    }
  }, [user, navigate, fetchEvent]);

  const toggleSeat = (seat) => {
    if (seat.status !== "available") return;
    if (reservation) return; // Cannot change selection if already reserved

    setSelected((prev) => {
      if (prev.includes(seat.seatNumber)) {
        return prev.filter((s) => s !== seat.seatNumber);
      } else {
        return [...prev, seat.seatNumber];
      }
    });
  };

  const getSeatStyle = (seat) => {
    const baseStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50px",
      borderRadius: "8px",
      fontWeight: "600",
      userSelect: "none",
    };

    if (seat.status === "booked") {
      return { ...baseStyle, backgroundColor: "#e74c3c", color: "white", cursor: "not-allowed" };
    }
    if (seat.status === "reserved") {
      return { ...baseStyle, backgroundColor: "#f39c12", color: "white", cursor: "not-allowed" };
    }
    if (selected.includes(seat.seatNumber)) {
      return { ...baseStyle, backgroundColor: "#6c3dd6", color: "white", cursor: "pointer" };
    }
    return { ...baseStyle, backgroundColor: "#e8f5e9", color: "#333", cursor: "pointer" };
  };

  const handleReserve = async () => {
    if (selected.length === 0) {
      setMessage("Please select at least one seat.");
      return;
    }
    try {
      const res = await axios.post("/api/reserve", { eventId: id, seatNumbers: selected });
      setReservation(res.data);
      setSelected([]);
      setMessage("");
      fetchEvent();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reserve seats");
    }
  };

  const handleBook = async () => {
    try {
      await axios.post("/api/bookings", { reservationId: reservation.reservation._id });
      setMessage(`✅ Booking confirmed! Seats: ${reservation.reservation.seatNumbers.join(", ")}`);
      setReservation(null);
      fetchEvent();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to confirm booking");
    }
  };

  const handleExpire = () => {
    setReservation(null);
    setMessage("Reservation expired!");
    fetchEvent();
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  if (!event) return <div style={{ padding: "2rem", textAlign: "center" }}>Event not found</div>;

  const containerStyle = { maxWidth: "800px", margin: "0 auto", padding: "2rem" };
  
  const legendStyle = {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap"
  };

  const legendItemStyle = (color, textColor = "white") => ({
    padding: "0.5rem 1rem",
    backgroundColor: color,
    color: textColor,
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "0.9rem"
  });

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
    gap: "10px",
    marginBottom: "2rem"
  };

  const actionBtnStyle = {
    backgroundColor: selected.length === 0 && !reservation ? "#ccc" : "#6c3dd6",
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "4px",
    cursor: selected.length === 0 && !reservation ? "not-allowed" : "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    width: "100%"
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: "#6c3dd6", marginBottom: "0.5rem" }}>{event.name}</h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "0.5rem" }}>📍 {event.venue}</p>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
        📅 {new Date(event.dateTime).toLocaleString()}
      </p>

      <div style={legendStyle}>
        <div style={legendItemStyle("#e8f5e9", "#333")}>Available</div>
        <div style={legendItemStyle("#6c3dd6")}>Selected</div>
        <div style={legendItemStyle("#f39c12")}>Reserved</div>
        <div style={legendItemStyle("#e74c3c")}>Booked</div>
      </div>

      <div style={gridStyle}>
        {seats.map((seat) => (
          <div
            key={seat._id}
            style={getSeatStyle(seat)}
            onClick={() => toggleSeat(seat)}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      {message && (
        <div style={{
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
          color: message.includes("✅") ? "#155724" : "#721c24",
          borderRadius: "4px",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          {message}
        </div>
      )}

      {reservation ? (
        <div>
          <CountdownTimer expiresAt={reservation.expiresAt} onExpire={handleExpire} />
          <button style={{ ...actionBtnStyle, backgroundColor: "#27ae60" }} onClick={handleBook}>
            ✅ Confirm Booking
          </button>
        </div>
      ) : (
        <button style={actionBtnStyle} disabled={selected.length === 0} onClick={handleReserve}>
          🔒 Reserve Selected Seats ({selected.length})
        </button>
      )}
    </div>
  );
};

export default EventDetail;
