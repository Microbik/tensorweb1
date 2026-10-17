import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Steps from './Steps.jsx';
import CalendarHeader from './CalendarHeader.jsx';
import CalendarGrid from './CalendarGrid.jsx';
import TimeSlots from './TimeSlots.jsx';
import {
  getSlotsForDate,
  MONTHS_GENITIVE,
  TODAY
} from '../data/date.js';

export default function BookingScreen() {
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
  const [selectedTime, setSelectedTime] = useState(null);

  const slots =
    selectedDay === null
      ? null
      : getSlotsForDate(currentYear, currentMonth, selectedDay);

  function handleDayClick(day) {
    if (day === selectedDay) return;
    setSelectedDay(day);
    setSelectedTime(null);
  }

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  }

  function handleNextButton() {
    if (selectedDay === null || selectedTime === null) {
      alert('Пожалуйста, выберите дату и время.');
      return;
    }
    alert(
      `Вы записаны на ${selectedDay} ${MONTHS_GENITIVE[currentMonth]} ${currentYear} в ${selectedTime}`
    );
  }

  return (
    <>
      <Header />
      <Steps />

      <main className="container main">
        <div className="page-heading">
          <Link className="back-link" to="/">‹ Назад</Link>
          <h1>Выберите желаемую дату</h1>
        </div>

        <div className="intro">
          <p>
            Наши мастера работают с 10:00 до
            <br />
            17:00 каждый день.
          </p>
          <button className="next-button" type="button" onClick={handleNextButton}>
            Далее
          </button>
        </div>

        <div className="booking">
          <section className="card calendar" aria-label="Календарь записи">
            <CalendarHeader
              month={currentMonth}
              year={currentYear}
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}
            />
            <CalendarGrid
              year={currentYear}
              month={currentMonth}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
            />
          </section>

          <section className="card time-card" aria-labelledby="time-title">
            <h2 id="time-title">Доступное время</h2>
            <TimeSlots
              slots={slots}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
            />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}