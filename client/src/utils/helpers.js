export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

export const daysRemaining = (deadline) => {
  const today = new Date();
  const end = new Date(deadline);
  const diff = end - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const isOverdue = (deadline) => {
  return new Date(deadline) < new Date();
};

export const getProgressColor = (progress) => {
  if (progress >= 75) return "#10b981";
  if (progress >= 40) return "#f59e0b";
  return "#ef4444";
};

export const getDayName = (date) => {
  return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
};

export const getMonthDays = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const isSameDay = (d1, d2) => {
  const a = new Date(d1);
  const b = new Date(d2);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const toISODateString = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};
