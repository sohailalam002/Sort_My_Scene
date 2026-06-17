import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await axios.post("/api/auth/register", form);
        setIsRegister(false);
        setForm({ username: "", password: "" });
      } else {
        const res = await axios.post("/api/auth/login", form);
        login(res.data.token, res.data.username);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "An error occurred");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 70px)",
    backgroundColor: "#f5f5f5",
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const btnStyle = {
    width: "100%",
    padding: "0.8rem",
    backgroundColor: "#6c3dd6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>
          {isRegister ? "Register" : "Login"}
        </h2>
        {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={btnStyle} type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <span
            style={{ color: "#6c3dd6", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Already have an account? Login" : "Need an account? Register"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
