import { useState, useEffect } from "react";

const CountdownTimer = ({ expiresAt, onExpire }) => {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    return Math.floor((new Date(expiresAt) - Date.now()) / 1000);
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      const remaining = Math.floor((new Date(expiresAt) - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(interval);
        setSecondsLeft(0);
        onExpire();
      } else {
        setSecondsLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire, secondsLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const style = {
    backgroundColor: "#f0ebff",
    padding: "1rem",
    borderRadius: "8px",
    marginTop: "1rem",
    marginBottom: "1rem",
    color: secondsLeft < 60 ? "red" : "#6c3dd6",
    fontWeight: "bold",
    textAlign: "center",
  };

  if (secondsLeft <= 0) return null;

  return (
    <div style={style}>
      ⏳ Reservation expires in: {formatTime(secondsLeft)}
    </div>
  );
};

export default CountdownTimer;
