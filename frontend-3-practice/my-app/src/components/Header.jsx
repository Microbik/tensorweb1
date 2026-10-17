import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: 'absolute' }}
      >
        <symbol id="brand-logo" viewBox="0 0 68 64">
          <path
            fill="currentColor"
            d="M7 54c-4 0-6-2-7-5 6 0 9-3 9-10V23 C9 13 17 6 26 6c5 0 9 2 12 5 3-2 6-2 9-1 7 2 12 8 12 15v15 c0 6 2 9 8 9-1 4-4 6-8 6 -9 0-15-6-15-15V25c-3 0-5 2-7 4 -3 2-6 3-11 3v8c0 9-7 14-19 14Z"
          />
        </symbol>
      </svg>

      <header className="header">
        <div className="container header__inner">
          <Link className="logo" to="/" aria-label="На главную">
            <svg aria-hidden="true">
              <use href="#brand-logo" />
            </svg>
          </Link>
          <nav className="navigation" aria-label="Основная навигация">
            <Link to="/services">Услуги</Link>
            <Link to="/gallery">Галерея</Link>
            <Link to="/team">Команда</Link>
            <Link to="/reviews">Отзывы</Link>
            <Link to="/contacts">Контакты</Link>
          </nav>
        </div>
      </header>
    </>
  );
}