import { Routes, Route } from 'react-router-dom';
import BookingScreen from './components/BookingScreen.jsx';
import SimplePage from './components/SimplePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingScreen />} />
      <Route path="/services" element={<SimplePage title="Услуги" />} />
      <Route path="/gallery" element={<SimplePage title="Галерея" />} />
      <Route path="/team" element={<SimplePage title="Команда" />} />
      <Route path="/reviews" element={<SimplePage title="Отзывы" />} />
      <Route path="/contacts" element={<SimplePage title="Контакты" />} />
      <Route path="/privacy" element={<SimplePage title="Политика конфиденциальности" />} />
      <Route path="*" element={<SimplePage title="Страница не найдена" />} />
    </Routes>
  );
}