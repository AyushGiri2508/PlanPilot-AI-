import { useMemo } from "react";
import { getMonthDays, getFirstDayOfMonth, isSameDay, toISODateString } from "../../utils/helpers";
import EventCard from "./EventCard";
import "./CalendarView.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = ({ year, month, schedule, onEntryUpdate }) => {
  const totalDays = getMonthDays(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const cells = useMemo(() => {
    const arr = [];
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      arr.push({ day: null, events: [] });
    }
    // Day cells
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      const dayEvents = schedule.filter((s) =>
        isSameDay(s.date, date)
      );
      arr.push({ day: d, date, events: dayEvents });
    }
    return arr;
  }, [year, month, schedule, firstDay, totalDays]);

  return (
    <div className="calendar-view">
      <div className="calendar-grid-header">
        {DAYS.map((d) => (
          <div key={d} className="calendar-day-name">
            {d}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`calendar-cell ${
              cell.day === null ? "empty" : ""
            } ${cell.date && isSameDay(cell.date, today) ? "today" : ""}`}
          >
            {cell.day && (
              <>
                <span className="calendar-cell-day">{cell.day}</span>
                <div className="calendar-cell-events">
                  {cell.events.slice(0, 3).map((evt) => (
                    <EventCard
                      key={evt._id}
                      event={evt}
                      onUpdate={onEntryUpdate}
                    />
                  ))}
                  {cell.events.length > 3 && (
                    <span className="calendar-more">
                      +{cell.events.length - 3} more
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
