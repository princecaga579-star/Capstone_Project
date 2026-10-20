
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/memberships", label: "Memberships" },
    { to: "/workout-programs", label: "Workout Programs" },
    { to: "/exercises", label: "Exercises" },
    { to: "/workout-logs", label: "Workout Logs" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-top">
        <NavLink to="/dashboard" className="brand">
          <span className="brand-mark">PF</span>
          <span>
            <strong>PRIME FITNESS</strong>
            <small>Membership & Workout Management</small>
          </span>
        </NavLink>

        <div className="navbar-user">
          <span>{user?.name || user?.email || "Gym Member"}</span>
          <button
            className="logout-button"
            onClick={handleLogout}
            type="button"
          >
            Log out
          </button>
        </div>
      </div>

      <nav className="navbar-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
