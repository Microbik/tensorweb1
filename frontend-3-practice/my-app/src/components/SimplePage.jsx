import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function SimplePage({ title, children }) {
  return (
    <>
      <Header />
      <main className="container main">
        <div className="page-heading">
          <Link className="back-link" to="/">‹ Назад</Link>
          <h1>{title}</h1>
        </div>
        {children}
      </main>
      <Footer />
    </>
  );
}