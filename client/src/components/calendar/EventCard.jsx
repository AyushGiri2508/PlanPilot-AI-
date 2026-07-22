import "./EventCard.css";

const EventCard = ({ event, onUpdate }) => {
  const statusClass = event.status?.toLowerCase().replace(" ", "-") || "pending";
  const title = event.task?.title || "Scheduled Task";

  const handleClick = () => {
    if (onUpdate && event.status !== "Completed") {
      onUpdate(event._id, { status: "Completed", completedHours: event.plannedHours });
    }
  };

  return (
    <div
      className={`event-card event-${statusClass}`}
      onClick={handleClick}
      title={`${title} — ${event.plannedHours}h`}
    >
      <span className="event-card-title">{title}</span>
      <span className="event-card-hours">{event.plannedHours}h</span>
    </div>
  );
};

export default EventCard;
