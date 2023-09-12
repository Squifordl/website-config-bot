import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css';
import botIcon from '../assets/sexy.png';

const NavButton = ({ label, route }) => {
  const navigate = useNavigate();
  return <button className="btn" onClick={() => navigate(route)}>{label}</button>;
};

function HomePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {overlayVisible && <div className="overlay" onClick={() => {
        setDropdownOpen(false);
        setOverlayVisible(false);
      }}></div>}

      <div className="home-container">
        <div className="button-container">
          <NavButton label="Login" route="/login" />
          <NavButton label="Dashboard" route="/dashboard" />
          <button className="btn mobile" onClick={() => {
            setDropdownOpen(!dropdownOpen);
            setOverlayVisible(!overlayVisible);
          }}>☰</button>
          <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
            <NavButton label="Login" route="/login" />
            <NavButton label="Dashboard" route="/dashboard" />
          </div>
        </div>
        <section className="hero-section">
          <img src={botIcon} alt="SuperBot Icon" className="bot-icon" />
          <h1 className="home-header">Bem-vindo ao SuperBot!</h1>
          <p className="home-description">
            O SuperBot é mais do que um simples bot para Discord. Descubra todas as funcionalidades que temos a oferecer!
          </p>
          <button className="btn action-btn" onClick={() => window.open('https://your-link-to-add-bot.com', '_blank')}>Adicionar o Bot</button>
          <NavButton label="Comandos" route="/comandos" />
        </section>
        <section className="features card-container">
          <div className="feature">
            <h3>Moderation</h3>
            <p>Mantenha seu servidor seguro e organizado.</p>
          </div>
          <div className="feature">
            <h3>Música</h3>
            <p>Crie a atmosfera perfeita com a sua playlist favorita.</p>
          </div>
          <div className="feature">
            <h3>Piadas</h3>
            <p>Quebre o gelo e divirta-se com nosso recurso de piadas!</p>
          </div>
        </section>
        <footer className="footer">
          <div className="footer-links">
            <a href="#about">Sobre Nós</a>
            <a href="#contact">Contato</a>
            <a href="#faq">FAQ</a>
          </div>
          <p>© 2023 SuperBot. All Rights Reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default HomePage;
