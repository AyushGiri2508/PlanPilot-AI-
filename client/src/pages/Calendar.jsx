import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule, updateEntry } from "../redux/slices/calendarSlice";
import CalendarView from "../components/calendar/CalendarView";
import Loader from "../components/common/Loader";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import toast from "react-hot-toast";
import "./Calendar.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const Calendar = () => {
  const dispatch = useDispatch();
  const { schedule, loading } = useSelector((state) => state.calendar);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const loadSchedule = useCallback(() => {
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    dispatch(fetchSchedule({ startDate: start, endDate: end }));
  }, [dispatch, year, month]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const handleEntryUpdate = async (entryId, data) => {
    try {
      await dispatch(updateEntry({ id: entryId, entryData: data })).unwrap();
      toast.success("Schedule updated!");
    } catch (err) {
      toast.error(err || "Update failed");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Calendar</h1>
        <p>Your AI-generated schedule</p>
      </div>

      <div className="calendar-controls">
        <div className="calendar-nav">
          <button className="btn btn-ghost" onClick={prevMonth}>
            <HiOutlineChevronLeft />
          </button>
          <h2 className="calendar-month-title">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button className="btn btn-ghost" onClick={nextMonth}>
            <HiOutlineChevronRight />
          </button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={goToday}>
          Today
        </button>
      </div>

      {loading ? (
        <Loader text="Loading schedule..." />
      ) : (
        <CalendarView
          year={year}
          month={month}
          schedule={schedule}
          onEntryUpdate={handleEntryUpdate}
        />
      )}
    </div>
  );
};

export default Calendar;
