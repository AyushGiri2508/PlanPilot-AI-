import { useState } from "react";
import { useDispatch } from "react-redux";
import { addGoal, editGoal } from "../../redux/slices/goalSlice";
import { CATEGORIES, PRIORITIES } from "../../utils/constants";
import { HiOutlineX } from "react-icons/hi";
import toast from "react-hot-toast";
import "./GoalForm.css";

const GoalForm = ({ onClose, goal = null }) => {
  const dispatch = useDispatch();
  const isEditing = !!goal;

  const [formData, setFormData] = useState({
    title: goal?.title || "",
    description: goal?.description || "",
    category: goal?.category || "Other",
    priority: goal?.priority || "Medium",
    deadline: goal?.deadline
      ? new Date(goal.deadline).toISOString().split("T")[0]
      : "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await dispatch(editGoal({ id: goal._id, goalData: formData })).unwrap();
        toast.success("Goal updated!");
      } else {
        await dispatch(addGoal(formData)).unwrap();
        toast.success("Goal created!");
      }
      onClose();
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Goal" : "Create New Goal"}</h2>
          <button className="modal-close" onClick={onClose}>
            <HiOutlineX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Become a MERN Developer in 90 days"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input goal-form-textarea"
              placeholder="Describe your goal in detail..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="goal-form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              name="deadline"
              className="form-input"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="goal-form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Goal"
                : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
