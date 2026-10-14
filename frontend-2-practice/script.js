'use strict';

const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const ALL_TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

const BUSY_SLOTS = {
  '2025-5-12': ['11:00', '13:00']
};

const FULLY_BUSY_DAYS = new Set(['2025-5-3', '2025-5-6']);

const TODAY = new Date(2025, 5, 10);

const state = {
  currentYear: TODAY.getFullYear(),
  currentMonth: TODAY.getMonth(),
  selectedDay: null,
  selectedTime: null,
  slots: []
};

function buildCalendarGrid(year, month) {
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

function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

function isDateSelectable(date, today) {
  return compareDates(date, today) >= 0;
}

function dateKey(year, month, day) {
  return `${year}-${month}-${day}`;
}

function getSlotsForDate(year, month, day) {
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

const calendarTitle = document.getElementById('calendar-title');
const calendarGrid = document.getElementById('calendar-grid');
const timeGrid = document.getElementById('time-grid');
const nextButton = document.getElementById('next-button');

function renderCalendar() {
  const { currentYear, currentMonth, selectedDay } = state;

  calendarTitle.textContent = `${MONTHS_NOMINATIVE[currentMonth]} ${currentYear}`;

  const weeks = buildCalendarGrid(currentYear, currentMonth);

  let html = '';

  html += WEEKDAYS_SHORT.map(
    (wd) => `<span class="weekday">${wd}</span>`
  ).join('');

  weeks.forEach((week) => {
    week.forEach((cell) => {
      if (cell.outside) {
        html += `<button class="day day--outside" type="button" disabled>${cell.day}</button>`;
        return;
      }

      const key = dateKey(currentYear, currentMonth, cell.day);
      const isBusy = FULLY_BUSY_DAYS.has(key);
      const selectable = isDateSelectable(cell.date, TODAY) && !isBusy;
      const isSelected = selectedDay === cell.day;

      let classes = 'day';
      if (isBusy) classes += ' day--busy';
      else if (!selectable) classes += ' day--disabled';
      if (isSelected) classes += ' day--selected';

      const disabledAttr = selectable ? '' : 'disabled';
      const ariaLabel = isBusy
        ? `${cell.day} ${MONTHS_GENITIVE[currentMonth]}, нет времени`
        : `${cell.day} ${MONTHS_GENITIVE[currentMonth]}`;
      const ariaPressed = isSelected ? 'aria-pressed="true"' : '';

      html += `<button class="${classes}" type="button" data-day="${cell.day}" ${disabledAttr} aria-label="${ariaLabel}" ${ariaPressed}>${cell.day}</button>`;
    });
  });

  calendarGrid.innerHTML = html;

  calendarGrid.querySelectorAll('.day:not(:disabled)').forEach((btn) => {
    btn.addEventListener('click', onDayClick);
  });
}

function renderTimeSlots() {
  const { selectedDay, currentYear, currentMonth, selectedTime } = state;

  if (selectedDay === null) {
    timeGrid.innerHTML = '<p class="time-empty">Выберите день</p>';
    return;
  }

  const slots = getSlotsForDate(currentYear, currentMonth, selectedDay);
  state.slots = slots;

  let html = '';
  slots.forEach((slot) => {
    const isSelected = selectedTime === slot.time;
    let classes = 'time';
    if (slot.busy) classes += ' time--busy';
    if (isSelected) classes += ' time--selected';

    const disabledAttr = slot.busy ? 'disabled' : '';
    const ariaPressed = isSelected ? 'aria-pressed="true"' : '';

    if (slot.busy) {
      html += `<button class="${classes}" type="button" ${disabledAttr}><span>${slot.time}</span><small>Занято</small></button>`;
    } else {
      html += `<button class="${classes}" type="button" data-time="${slot.time}" ${disabledAttr} ${ariaPressed}>${slot.time}</button>`;
    }
  });

  timeGrid.innerHTML = html;

  timeGrid.querySelectorAll('.time:not(:disabled)').forEach((btn) => {
    btn.addEventListener('click', onTimeSlotClick);
  });
}

function onDayClick(event) {
  const day = Number(event.currentTarget.dataset.day);
  if (day === state.selectedDay) return;

  state.selectedDay = day;
  state.selectedTime = null;

  renderCalendar();
  renderTimeSlots();
}

function onTimeSlotClick(event) {
  const time = event.currentTarget.dataset.time;
  state.selectedTime = time;

  renderTimeSlots();
}

function handlePrevMonth() {
  state.currentMonth--;
  if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear--;
  }
  state.selectedDay = null;
  state.selectedTime = null;
  renderCalendar();
  renderTimeSlots();
}

function handleNextMonth() {
  state.currentMonth++;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear++;
  }
  state.selectedDay = null;
  state.selectedTime = null;
  renderCalendar();
  renderTimeSlots();
}

function setupNextButton() {
  nextButton.addEventListener('click', () => {
    if (state.selectedDay === null || state.selectedTime === null) {
      alert('Пожалуйста, выберите дату и время.');
      return;
    }
    alert(`Вы записаны на ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear} в ${state.selectedTime}`);
  });
}

function init() {
  state.currentYear = TODAY.getFullYear();
  state.currentMonth = TODAY.getMonth();
  state.selectedDay = TODAY.getDate();
  state.selectedTime = null;

  renderCalendar();
  renderTimeSlots();

  setupNextButton();
}

window.handlePrevMonth = handlePrevMonth;
window.handleNextMonth = handleNextMonth;

document.addEventListener('DOMContentLoaded', init);