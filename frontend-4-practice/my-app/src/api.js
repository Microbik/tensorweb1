async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Ошибка сервера: ${response.status}`);
  }
  return response.json();
}

export async function fetchToday() {
  return request('/api/booking/today');
}

export async function fetchSlots({ day, month, year }) {
  const params = new URLSearchParams({ day, month, year });
  return request(`/api/slots?${params.toString()}`);
}

export async function fetchBusyDays({ month, year }) {
  const params = new URLSearchParams({ month, year });
  return request(`/api/busy-days?${params.toString()}`);
}