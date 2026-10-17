export default function TimeSlots({ slots, selectedTime, onSelect }) {
  if (!slots) {
    return <p className="time-empty">Выберите день</p>;
  }

  return (
    <div className="time-grid">
      {slots.map((slot) => {
        const isSelected = selectedTime === slot.time;
        const classes = ['time'];
        if (slot.busy) classes.push('time--busy');
        if (isSelected) classes.push('time--selected');

        return (
          <button
            key={slot.time}
            className={classes.join(' ')}
            type="button"
            disabled={slot.busy}
            aria-pressed={isSelected ? 'true' : undefined}
            onClick={() => onSelect(slot.time)}
          >
            {slot.busy ? (
              <>
                <span>{slot.time}</span>
                <small>Занято</small>
              </>
            ) : (
              slot.time
            )}
          </button>
        );
      })}
    </div>
  );
}