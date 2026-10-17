const STEPS = [
  { number: 1, label: <>Выбор<br />Специалиста</>, state: 'complete' },
  { number: 2, label: 'Выбор Услуги', state: 'complete' },
  { number: 3, label: 'Выбор даты', state: 'active' },
  { number: 4, label: <>Заполнить<br />Контакты</>, state: '' },
  { number: 5, label: 'Подтверждение', state: '' }
];

export default function Steps() {
  return (
    <nav className="steps" aria-label="Этапы записи">
      <div className="container">
        <ol className="steps__list">
          {STEPS.map((step) => {
            const className = [
              'step',
              step.state === 'complete' && 'step--complete',
              step.state === 'active' && 'step--active'
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <li
                key={step.number}
                className={className}
                aria-current={step.state === 'active' ? 'step' : undefined}
              >
                <span className="step__number">{step.number}</span>
                <span className="step__label">{step.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}