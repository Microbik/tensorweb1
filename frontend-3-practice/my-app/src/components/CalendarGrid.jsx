import {
  buildCalendarGrid,
  dateKey,
  isDateSelectable,
  MONTHS_GENITIVE,
  WEEKDAYS_SHORT,
  FULLY_BUSY_DAYS,
  TODAY
} from '../data/date.js';

export default function CalendarGrid({
  year,
  month,
  selectedDay,
  onDayClick
}) {
  const weeks = buildCalendarGrid(year, month);

  return (
    <div className="calendar__grid">
      {WEEKDAYS_SHORT.map((wd) => (
        <span key={wd} className="weekday">
          {wd}
        </span>
      ))}

      {weeks.map((week, weekIndex) =>
        week.map((cell, dayIndex) => {
          const key = `${weekIndex}-${dayIndex}`;

          if (cell.outside) {
            return (
              <button
                key={key}
                className="day day--outside"
                type="button"
                disabled
              >
                {cell.day}
              </button>
            );
          }

          const cellKey = dateKey(year, month, cell.day);
          const isBusy = FULLY_BUSY_DAYS.has(cellKey);
          const selectable = isDateSelectable(cell.date, TODAY) && !isBusy;
          const isSelected = selectedDay === cell.day;

          const classes = ['day'];
          if (isBusy) classes.push('day--busy');
          else if (!selectable) classes.push('day--disabled');
          if (isSelected) classes.push('day--selected');

          const ariaLabel = isBusy
            ? `${cell.day} ${MONTHS_GENITIVE[month]}, нет времени`
            : `${cell.day} ${MONTHS_GENITIVE[month]}`;

          return (
            <button
              key={key}
              className={classes.join(' ')}
              type="button"
              disabled={!selectable}
              aria-label={ariaLabel}
              aria-pressed={isSelected ? 'true' : undefined}
              onClick={() => onDayClick(cell.day)}
            >
              {cell.day}
            </button>
          );
        })
      )}
    </div>
  );
}