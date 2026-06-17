import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "2rem",
    padding: "2rem",
  };

  const cardStyle = {
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const btnStyle = {
    backgroundColor: "#6c3dd6",
    color: "white",
    border: "none",
    padding: "0.8rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "1rem",
    width: "100%",
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading events...</div>;
  }

  return (
    <div>
      <h2 style={{ padding: "0 2rem", marginTop: "2rem", color: "#333" }}>Upcoming Events</h2>
      <div style={gridStyle}>
        {events.map((event) => (
          <div key={event._id} style={cardStyle}>
            <div>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#6c3dd6" }}>{event.name}</h3>
              <p style={{ margin: "0.2rem 0", color: "#555" }}>📍 {event.venue}</p>
              <p style={{ margin: "0.2rem 0", color: "#555" }}>
                📅 {new Date(event.dateTime).toLocaleString()}
              </p>
              <p style={{ margin: "0.2rem 0", color: "#555" }}>🎟 Total Seats: {event.totalSeats}</p>
            </div>
            <button style={btnStyle} onClick={() => navigate(`/event/${event._id}`)}>
              Book Seats
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
