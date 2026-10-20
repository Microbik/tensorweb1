export const database = {
  today: { day: 10, month: 5, year: 2025 },

  slotsByDate: {
    '2025-5-13': [], // полностью занят
    '2025-5-16': [],
    '2025-5-10': [
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '12:00', available: true },
      { time: '13:00', available: true },
      { time: '14:00', available: false },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: true }
    ],
    '2025-5-12': [
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '12:00', available: true },
      { time: '13:00', available: false },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: true }
    ]
  }
};

export const ALL_TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

export function isFullyBusyDay(year, month, day) {
  const slots = database.slotsByDate[`${year}-${month}-${day}`];
  if (!slots) return false;
  return slots.length === 0 || slots.every((s) => !s.available);
}