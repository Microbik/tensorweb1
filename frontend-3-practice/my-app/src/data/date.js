export const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const WEEKDAYS_FULL = [
  'воскресенье', 'понедельник', 'вторник', 'среда',
  'четверг', 'пятница', 'суббота'
];

export const ALL_TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

export const BUSY_SLOTS = {
  '2025-5-12': ['11:00', '13:00']
};

export const FULLY_BUSY_DAYS = new Set(['2025-5-3', '2025-5-6']);

export const TODAY = new Date(2025, 5, 10);

export function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    cells.push({ day, date, outside: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ day: d, date, outside: false });
  }

  let nextDay = 1;
  while (cells.length < 42) {
    const date = new Date(year, month + 1, nextDay);
    cells.push({ day: nextDay, date, outside: true });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

export function isDateSelectable(date, today = TODAY) {
  return compareDates(date, today) >= 0;
}

export function dateKey(year, month, day) {
  return `${year}-${month}-${day}`;
}

export function getSlotsForDate(year, month, day) {
  const key = dateKey(year, month, day);
  if (FULLY_BUSY_DAYS.has(key)) {
    return ALL_TIME_SLOTS.map((time) => ({ time, busy: true }));
  }
  const busyTimes = BUSY_SLOTS[key] || [];
  return ALL_TIME_SLOTS.map((time) => ({
    time,
    busy: busyTimes.includes(time)
  }));
}