import { useState, useEffect } from "react";
import { createUser, getUsers, deleteUser, updateUser } from "../network/user";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    role: "user",
    password: "",
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users: ", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        const updateData = { ...formData };

        if (!updateData.password) delete updateData.password;

        await updateUser(editingUserId, updateData);
        setMessage("User updated successfully!");
      } else {
        const response = await createUser(formData);
        setMessage(`User created! Password: ${response.data.password}`);
      }

      setFormData({
        name: "",
        email: "",
        username: "",
        role: "user",
        password: "",
      });
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user: ", error);
      setMessage("An error occurred while saving the user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      password: "",
    });
  };

  const confirmDeleteUser = (id) => {
    const user = users.find((user) => user.id === id);

    if (user && user.role === "admin") {
      setMessage("Admin users cannot be deleted.");
      return;
    }

    setUserToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userToDelete);
      setShowDeleteDialog(false);
      setUserToDelete(null);
      fetchUsers();
      setMessage("User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user: ", error);
      setMessage("An error occurred while deleting the user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin-login");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">Admin Panel</h2>
        <div className="relative">
          {/* Profile Icon */}
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="text-gray-800 text-3xl focus:outline-none"
          >
            <FaUserCircle />
          </button>

          {/* Profile Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-700">
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

      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-8 shadow-lg rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {editingUserId ? "Edit User" : "Create User"}
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {editingUserId && (
            <input
              type="password"
              placeholder="New Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-600"
        >
          {editingUserId ? "Update" : "Create"}
        </button>
      </form>

      <table className="table-auto w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2 text-center">ID</th>
            <th className="px-4 py-2 text-center">Name</th>
            <th className="px-4 py-2 text-center">Email</th>
            <th className="px-4 py-2 text-center">Username</th>
            <th className="px-4 py-2 text-center">Role</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-2 text-center">{user.id}</td>
                <td className="px-4 py-2 text-center">{user.name}</td>
                <td className="px-4 py-2 text-center">{user.email}</td>
                <td className="px-4 py-2 text-center">{user.username}</td>
                <td className="px-4 py-2 text-center">{user.role}</td>
                <td className="px-4 py-2 text-center flex justify-center gap-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (user.role === "admin") {
                        setMessage("Admin users cannot be deleted.");
                      } else {
                        confirmDeleteUser(user.id);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-white ${
                      user.role === "admin"
                        ? "bg-red-700 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    disabled={user.role === "admin"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center">
                No users available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
