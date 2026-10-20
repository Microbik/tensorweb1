import { database, ALL_TIME_SLOTS, isFullyBusyDay } from './database.js';

const DELAY_MS = 632; // имитация сети

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default function mockApiPlugin() {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (!url.pathname.startsWith('/api/')) return next();

        await delay(DELAY_MS);

        if (url.pathname === '/api/booking/today') {
          return json(res, 200, database.today);
        }

        if (url.pathname === '/api/slots') {
          const day = Number(url.searchParams.get('day'));
          const month = Number(url.searchParams.get('month'));
          const year = Number(url.searchParams.get('year'));

          if (!day || Number.isNaN(month) || !year) {
            return json(res, 400, { error: 'Некорректные параметры даты' });
          }

          const key = `${year}-${month}-${day}`;
          const busy = database.slotsByDate[key];

          // если для даты нет записи — все слоты свободны
          const slots = busy
            ? busy
            : ALL_TIME_SLOTS.map((time) => ({ time, available: true }));

          return json(res, 200, {
            date: { day, month, year },
            slots
          });
        }

        if (url.pathname === '/api/busy-days') {
            const month = Number(url.searchParams.get('month'));
            const year = Number(url.searchParams.get('year'));

            if (Number.isNaN(month) || !year) {
                return json(res, 400, { error: 'Некорректные параметры' });
            }

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const busyDays = [];
            for (let d = 1; d <= daysInMonth; d++) {
                if (isFullyBusyDay(year, month, d)) busyDays.push(d);
            }

            return json(res, 200, { month, year, busyDays });
        }

        return json(res, 404, { error: 'Not found' });

        
      });
    }
  };
}