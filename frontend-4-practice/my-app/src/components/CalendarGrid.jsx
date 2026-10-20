import {
  buildCalendarGrid,
  isDateSelectable,
  MONTHS_GENITIVE,
  WEEKDAYS_SHORT
} from '../data/date.js';

export default function CalendarGrid({
  year,
  month,
  selectedDay,
  today,
  busyDays = new Set(),
  onDayClick
}) {
  const weeks = buildCalendarGrid(year, month);

  return (
    <div className="calendar__grid">
      {WEEKDAYS_SHORT.map((wd) => (
        <span key={wd} className="weekday">{wd}</span>
      ))}

      {weeks.map((week, weekIndex) =>
        week.map((cell, dayIndex) => {
          const key = `${weekIndex}-${dayIndex}`;

          if (cell.outside) {
            return (
              <button key={key} className="day day--outside" type="button" disabled>
                {cell.day}
              </button>
            );
          }

          const isBusy = busyDays.has(cell.day);
          const selectable = isDateSelectable(cell.date, today) && !isBusy;
          const isSelected = selectedDay === cell.day;

          const classes = ['day'];
          if (isBusy) classes.push('day--busy');
          else if (!selectable) classes.push('day--disabled');
          if (isSelected) classes.push('day--selected');

          return (
            <button
              key={key}
              className={classes.join(' ')}
              type="button"
              disabled={!selectable}
              aria-label={`${cell.day} ${MONTHS_GENITIVE[month]}`}
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