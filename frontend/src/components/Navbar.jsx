import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#6c3dd6",
    color: "white",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.2rem",
  };

  const btnStyle = {
    backgroundColor: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "1rem",
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link style={linkStyle} to="/">🎟 SortMyScene</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: "1rem" }}>Welcome, {user.username}</span>
            <button style={btnStyle} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link style={linkStyle} to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
