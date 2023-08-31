import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css';
import botIcon from '../assets/sexy.png';

function HomePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="home-container">
      <div className="button-container">
        <button className="btn desktop" onClick={() => navigate('/login')}>Login</button>
        <button className="btn desktop" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="btn mobile" onClick={() => setDropdownOpen(!dropdownOpen)}>☰</button>
        <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
          <button className="btn" onClick={() => navigate('/login')}>Login</button>
          <button className="btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
        </div>
      </div>
      <section className="hero-section">
        <img src={botIcon} alt="SuperBot Icon" className="bot-icon" />
        <h1 className="home-header">Bem-vindo ao SuperBot!</h1>
        <p className="home-description">
          O SuperBot é mais do que um simples bot para Discord. Descubra todas as funcionalidades que temos a oferecer!
        </p>
        <button className="btn action-btn" onClick={() => window.open('https://your-link-to-add-bot.com', '_blank')}>Adicionar o Bot</button>
        <button className="btn action-btn" onClick={() => navigate('/comandos')}>Comandos</button>
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
        <p>© 2023 SuperBot. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
