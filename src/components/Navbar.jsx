import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Event Booking System
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            {user.role !== "admin" && <Link to="/bookings">My Bookings</Link>}
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="ml-2">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
