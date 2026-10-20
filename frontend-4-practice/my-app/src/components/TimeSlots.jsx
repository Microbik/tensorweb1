export default function TimeSlots({ slots, loading, error, selectedTime, onSelect }) {
  if (loading) {
    return <p className="time-empty">Загрузка слотов…</p>;
  }

  if (error) {
    return <p className="time-empty" role="alert">Не удалось загрузить слоты: {error}</p>;
  }

  if (!slots) {
    return <p className="time-empty">Выберите день</p>;
  }

  if (slots.length === 0) {
    return <p className="time-empty">На этот день нет доступного времени</p>;
  }

  return (
    <div className="time-grid">
      {slots.map((slot) => {
        const isSelected = selectedTime === slot.time;
        const classes = ['time'];
        if (!slot.available) classes.push('time--busy');
        if (isSelected) classes.push('time--selected');

        return (
          <button
            key={slot.time}
            className={classes.join(' ')}
            type="button"
            disabled={!slot.available}
            aria-pressed={isSelected ? 'true' : undefined}
            onClick={() => onSelect(slot.time)}
          >
            {slot.available ? (
              slot.time
            ) : (
              <>
                <span>{slot.time}</span>
                <small>Занято</small>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}