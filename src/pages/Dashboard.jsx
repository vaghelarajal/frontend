import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../api/auth";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    address: "",
    gender: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setProfileForm({
      address: user.address || "",
      gender: user.gender || "",
      age: user.age || "",
    });
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await updateProfile({
        email: user.email,
        ...profileForm,
        age: profileForm.age ? parseInt(profileForm.age) : null,
      });

      const updatedUser = response.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      setMessage("Profile updated successfully!");

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h3>Dashboard</h3>

        <div className="profile-wrapper">
          <div
            className={`profile-button ${showProfile ? "active" : ""}`}
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="profile-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span>Profile</span>
          </div>

          {showProfile && (
            <div className="profile-dropdown">
              {message && (
                <div
                  className={`profile-message ${
                    message.includes("success") ? "success" : "error"
                  }`}
                >
                  {message}
                </div>
              )}

              {!editMode ? (
                <>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Address:</strong> {user.address || "Not provided"}</p>
                  <p><strong>Gender:</strong> {user.gender || "Not provided"}</p>
                  <p><strong>Age:</strong> {user.age || "Not provided"}</p>

                  <div className="profile-actions">
                    <button className="btn-primary" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </button>
                    <button className="btn-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleProfileUpdate}>
                  <label>
                    Address
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, address: e.target.value })
                      }
                    />
                  </label>

                  <label>
                    Gender
                    <select
                      value={profileForm.gender}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, gender: e.target.value })
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label>
                    Age
                    <input
                      type="number"
                      min="13"
                      max="100"
                      value={profileForm.age}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, age: e.target.value })
                      }
                    />
                  </label>

                  <div className="profile-actions">
                    <button className="btn-success" type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="btn-secondary"
                      type="button"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="dashboard-hero">
        <h1>Hello, {user.username}!</h1>
        <p>Welcome to your dashboard!</p>
      </section>
    </div>
  );
};

export default Dashboard;
