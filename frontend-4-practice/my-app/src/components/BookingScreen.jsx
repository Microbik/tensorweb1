import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Steps from './Steps.jsx';
import CalendarHeader from './CalendarHeader.jsx';
import CalendarGrid from './CalendarGrid.jsx';
import TimeSlots from './TimeSlots.jsx';
import BookingBottomBar from './BookingBottomBar.jsx';
import { fetchToday, fetchSlots, fetchBusyDays } from '../api.js';
import { MONTHS_GENITIVE } from '../data/date.js';

export default function BookingScreen() {
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  const [currentYear, setCurrentYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // ЗАНЯТЫЕ ДНИ МЕСЯЦА
  const [busyDays, setBusyDays] = useState(new Set());
  const [busyDaysLoading, setBusyDaysLoading] = useState(false);
  const [initialBusyDaysLoaded, setInitialBusyDaysLoaded] = useState(false);

  // 1) «сегодня»
  useEffect(() => {
    let cancelled = false;
    setTodayLoading(true);
    setTodayError(null);

    fetchToday()
      .then((data) => {
        if (cancelled) return;
        setToday(data);
        setCurrentYear(data.year);
        setCurrentMonth(data.month);
        setSelectedDay(data.day);
      })
      .catch((err) => { if (!cancelled) setTodayError(err.message); })
      .finally(() => { if (!cancelled) setTodayLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // 2) ЗАНЯТЫЕ ДНИ ПРИ СМЕНЕ МЕСЯЦА
  useEffect(() => {
    if (currentMonth === null || currentYear === null) return;

    let cancelled = false;
    setBusyDaysLoading(true);

    fetchBusyDays({ month: currentMonth, year: currentYear })
      .then((data) => {
        if (cancelled) return;
        setBusyDays(new Set(data.busyDays));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('busy-days:', err);
        setBusyDays(new Set());
      })
      .finally(() => {
        if (!cancelled) {
          setBusyDaysLoading(false);
          setInitialBusyDaysLoaded(true);
        }
      });

    return () => { cancelled = true; };
  }, [currentMonth, currentYear]);

  // 3) слоты
  useEffect(() => {
    if (selectedDay === null || currentMonth === null) return;

    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError(null);

    const requestDate = { day: selectedDay, month: currentMonth, year: currentYear };

    fetchSlots(requestDate)
      .then((data) => {
        if (cancelled) return;
        const same =
          data.date.day === selectedDay &&
          data.date.month === currentMonth &&
          data.date.year === currentYear;
        if (!same) return;
        setSlots(data.slots);
      })
      .catch((err) => {
        if (!cancelled) {
          setSlots([]);
          setSlotsError(err.message);
        }
      })
      .finally(() => { if (!cancelled) setSlotsLoading(false); });

    return () => { cancelled = true; };
  }, [selectedDay, currentMonth, currentYear]);

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
    setSlots(null);
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
    setSlots(null);
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

  // Ждём И сегодня, И первые busy-days, чтобы календарь сразу отрисовался правильно
  const initialLoading =
    todayLoading || (currentMonth !== null && !initialBusyDaysLoaded);

  if (initialLoading) {
    return (
      <>
        <Header />
        <main className="container main">
          <p>Загрузка…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (todayError) {
    return (
      <>
        <Header />
        <main className="container main">
          <p role="alert">Не удалось загрузить данные: {todayError}</p>
        </main>
        <Footer />
      </>
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
              today={new Date(today.year, today.month, today.day)}
              busyDays={busyDays}
              onDayClick={handleDayClick}
            />
          </section>

          <section className="card time-card" aria-labelledby="time-title">
            <h2 id="time-title">Доступное время</h2>
            <TimeSlots
              slots={slots}
              loading={slotsLoading}
              error={slotsError}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
            />
          </section>
        </div>

        <BookingBottomBar
          year={currentYear}
          month={currentMonth}
          day={selectedDay}
          time={selectedTime}
        />
      </main>

      <Footer />
    </>
  );
}