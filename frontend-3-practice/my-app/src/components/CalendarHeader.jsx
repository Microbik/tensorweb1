import { MONTHS_NOMINATIVE } from '../data/date.js';

export default function CalendarHeader({ month, year, onPrev, onNext }) {
  return (
    <div className="calendar__header">
      <h2 id="calendar-title">
        {MONTHS_NOMINATIVE[month]} {year}
      </h2>
      <div className="calendar__controls">
        <button
          className="month-button"
          type="button"
          aria-label="Предыдущий месяц"
          onClick={onPrev}
        >
          ‹
        </button>
        <button
          className="month-button"
          type="button"
          aria-label="Следующий месяц"
          onClick={onNext}
        >
          ›
        </button>
      </div>
    </div>
  );
}