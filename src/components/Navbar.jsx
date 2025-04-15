import { useAuth } from "../network/services/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Logo from "../assets/logo.svg"; // Adjust the path as necessary

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-black to-green-700 text-white p-2 shadow-lg z-50 h-[80px]">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 max-h-5">
          <a href="/">
            <img
              src={Logo}
              alt="Logo"
              className="max-h-[180px]"
            />
          </a>
        </div>

        <h1 className="text-2xl font-bold"></h1>

        {/* Profile Section */}
        <div className="relative">
          {/* Profile Icon */}
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="text-white flex items-center gap-2 focus:outline-none"
            aria-label="Profile menu"
          >
            <FaUserCircle className="text-3xl" />
            <FaChevronDown
              className={`text-md transition-transform ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-700">
              <div className="p-4 border-b">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
