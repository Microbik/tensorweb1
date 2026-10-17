import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <Link className="logo" to="/" aria-label="На главную">
              <svg aria-hidden="true">
                <use href="#brand-logo" />
              </svg>
            </Link>
            <p className="footer__description">Дружелюбное описание услуг</p>
          </div>
          <section>
            <h2>Контакты</h2>
            <address>
              <p>ул. Садовая, 15, Москва</p>
              <p>
                <a className="footer__phone" href="tel:+74951234567">
                  +7 (495) 123-45-67
                </a>
              </p>
            </address>
          </section>
          <section>
            <h2>Режим работы</h2>
            <p className="footer__hours">
              Пн–Пт: 9:00 – 21:00
              <br />
              Сб–Вс: 10:00 – 19:00
            </p>
          </section>
        </div>
        <div className="footer__bottom">
          <p>© 2026. Все права защищены.</p>
          <Link to="/privacy">Политика конфиденциальности</Link>
        </div>
      </div>
    </footer>
  );
}