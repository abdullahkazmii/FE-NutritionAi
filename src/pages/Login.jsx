import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../network/services/auth";
import { getPlan } from "../network/services/GetPlan";
import { useAuth } from "../network/services/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      console.error("Username and password are required");
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      console.log("Submitting login form with:", formData);
      const fd = new FormData();
      fd.append("username", formData.username);
      fd.append("password", formData.password);
      const response = await loginRequest(fd);

      if (response.success) {
        if (response.data.User.role === "admin") {
          setErrorMessage(
            "Admins cannot log in here. Please use the admin login page."
          );
          return;
        }

        setErrorMessage("");
        login(response.data.User);
        localStorage.setItem("token", response.data.access_token);

        const plansResponse = await getPlan();
        if (plansResponse.success && plansResponse.data.length > 0) {
          navigate("/home");
        } else {
          navigate("/form");
        }
      } else {
        setErrorMessage("Invalid username or password.");
        console.error("Login failed:", response);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-black to-green-700">
      {/* Left Side */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 text-white px-10">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-lg">
          To keep connected with us, please log in with your personal info.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white shadow-lg">
        <div className="w-4/5 max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-center text-sm">
                {errorMessage}
              </div>
            )}

            <button
              className="w-full py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-900 transition duration-300"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
