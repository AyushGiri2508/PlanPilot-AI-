import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateUserProfile } from "../redux/slices/authSlice";
import { HiOutlineUser, HiOutlineMail, HiOutlineClock } from "react-icons/hi";
import toast from "react-hot-toast";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateUserProfile({ name })).unwrap();
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile & Settings</h1>
        <p>Manage your account settings</p>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="glass-card-static profile-card">
          <div className="profile-avatar">
            <HiOutlineUser />
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">
            <HiOutlineMail /> {user?.email}
          </p>
          <div className="profile-meta">
            <div className="profile-meta-item">
              <HiOutlineClock />
              <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="glass-card-static">
          <h3 style={{ marginBottom: 20, fontWeight: 700 }}>Edit Profile</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ""}
                disabled
                style={{ opacity: 0.5 }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
