const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const daysRemaining = (deadline) => {
  const today = new Date();
  const end = new Date(deadline);

  const diff = end - today;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const isOverdue = (deadline) => {
  return new Date(deadline) < new Date();
};

module.exports = {
  formatDate,
  daysRemaining,
  isOverdue,
};