import { MONTHS_GENITIVE, WEEKDAYS_FULL } from '../data/date.js';

export default function BookingBottomBar({ year, month, day, time }) {
  if (day === null) {
    return (
      <div className="bottom-bar">
        <p>Выберите дату и время</p>
      </div>
    );
  }

  const date = new Date(year, month, day);
  const weekday = WEEKDAYS_FULL[date.getDay()];

  return (
    <div className="bottom-bar">
      <p>
        {weekday}, {day} {MONTHS_GENITIVE[month]} {year}
        {time ? `, ${time}` : ''}
      </p>
    </div>
  );
}