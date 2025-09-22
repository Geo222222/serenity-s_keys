import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './SharedFooter.css';

const SharedFooter = ({ currentApp = 'tech' }) => {
  // Define app-specific configurations
  const appConfigs = {
    tech: {
      title: 'DJ Martin',
      subtitle: 'Real-Time ML Systems Architect',
      primaryColor: '#3a86ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      tagline: 'Building Tomorrow\'s Technology Today',
      specialNote: 'Est. 1993',
      email: 'djuvanemartin@gmail.com'
    },
    photo: {
      title: 'DJ Martin Photography',
      subtitle: 'Visual Storyteller',
      primaryColor: '#ff6b6b',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      tagline: 'Capturing Jamaica\'s Beauty Since University',
      specialNote: 'Available Worldwide',
      email: 'photo@djuvanemartin.com'
    },
    education: {
      title: 'Serenity\'s Keys',
      subtitle: 'by Djuvane Martin',
      primaryColor: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      tagline: 'Where Calm Meets Mastery in Typing Education',
      specialNote: 'Named after my daughter Serenity',
      email: 'keyboard@djuvanemartin.com'
    },
    benjai: {
      title: 'BenjAI',
      subtitle: 'AI-Powered Business Growth',
      primaryColor: '#7F3FBF',
      gradient: 'linear-gradient(135deg, #7F3FBF 0%, #00D084 100%)',
      tagline: 'Where AI agents work through day and night',
      specialNote: 'Converting prospects with digital might',
      email: 'hello@benjai.ai'
    },
    landing: {
      title: 'DJ Martin',
      subtitle: 'Technology · Photography · Education',
      primaryColor: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      tagline: 'Empowering businesses, capturing moments, teaching tomorrow\'s typists',
      specialNote: 'Multi-Disciplinary Professional',
      email: 'djuvanemartin@gmail.com'
    }
  };

  const config = appConfigs[currentApp] || appConfigs.tech;

  // Navigation links - always show all realms except current
  const getNavigationLinks = () => {
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5173' : 'https://djuvanemartin.com';
    
    const allLinks = [
      {
        id: 'landing',
        label: '🏠 Home',
        url: baseUrl,
        show: currentApp !== 'landing'
      },
      {
        id: 'tech',
        label: '⚡ Tech Services',
        url: window.location.hostname === 'localhost' ? `${baseUrl}/?app=tech` : 'https://tech.djuvanemartin.com',
        show: currentApp !== 'tech'
      },
      {
        id: 'benjai',
        label: '🤖 BenjAI',
        url: window.location.hostname === 'localhost' ? `${baseUrl}#/benjai` : `${baseUrl}#/benjai`,
        show: currentApp !== 'benjai'
      },
      {
        id: 'photo',
        label: '📸 Photography',
        url: window.location.hostname === 'localhost' ? `${baseUrl}/?app=photo` : 'https://photo.djuvanemartin.com',
        show: currentApp !== 'photo'
      },
      {
        id: 'education',
        label: '🌸 Serenity\'s Keys',
        url: window.location.hostname === 'localhost' ? `${baseUrl}/?app=education` : 'https://education.djuvanemartin.com',
        show: currentApp !== 'education'
      }
    ];

    return allLinks.filter(link => link.show);
  };

  // Render expanded footer for landing page
  if (currentApp === 'landing') {
    return (
      <footer className="expanded-footer">
        {/* Top Row - Navigation & Social Links */}
        <div className="footer-top">
          <div className="footer-section">
            <h4 className="footer-section-title">Explore Other Realms</h4>
            <div className="realm-links">
              {getNavigationLinks().map(link => (
                <a key={link.id} href={link.url} className="realm-link">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <div className="service-category-links">
              <a href="https://tech.djuvanemartin.com" className="service-link">Tech Services</a>
              <span className="separator">|</span>
              <a href={window.location.hostname === 'localhost' ? `${window.location.origin}#/benjai` : `${window.location.origin}#/benjai`} className="service-link">BenjAI</a>
              <span className="separator">|</span>
              <a href="https://photo.djuvanemartin.com" className="service-link">Photography</a>
              <span className="separator">|</span>
              <a href="https://education.djuvanemartin.com" className="service-link">Serenity's Keys</a>
            </div>
          </div>

          <div className="footer-section">
            <div className="social-icons">
              <a href="https://github.com/Geo222222" target="_blank" rel="noreferrer" className="social-icon">
                <FaGithub size={24} />
              </a>
              <a href="https://www.linkedin.com/in/djuvane-martin-48116766/" target="_blank" rel="noreferrer" className="social-icon">
                <FaLinkedin size={24} />
              </a>
              <a href={`mailto:${config.email}`} className="social-icon">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Middle Row - Personal Branding */}
        <div className="footer-middle">
          <div className="personal-branding">
            <h2 className="brand-name">DJ Martin</h2>
            <p className="brand-tagline">Technology · Photography · Education</p>
            <p className="brand-motto">Empowering businesses, capturing moments, teaching tomorrow's typists.</p>
          </div>
        </div>

        {/* Bottom Row - Legal & Copyright */}
        <div className="footer-bottom">
          <div className="legal-links">
            <a href="/privacy.html" target="_blank" rel="noreferrer">Privacy Policy</a>
            <a href="/terms.html" target="_blank" rel="noreferrer">Terms</a>
            <a href={`mailto:${config.email}`}>Contact</a>
          </div>
          <div className="copyright-section">
            <p>&copy; 2025 DJ Martin | Multi-Disciplinary Professional</p>
          </div>
        </div>
      </footer>
    );
  }

  // Default footer for other apps
  return (
    <footer className={`shared-footer ${currentApp}-footer`} style={{ '--primary-color': config.primaryColor }}>
      <div className="footer-container">
        {/* Navigation to Other Realms */}
        <div className="footer-navigation">
          <h4 className="nav-title">Explore Other Realms</h4>
          <div className="nav-links">
            {getNavigationLinks().map(link => (
              <a
                key={link.id}
                href={link.url}
                className="footer-nav-link"
                style={{ background: `${config.primaryColor}15`, borderColor: `${config.primaryColor}30` }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="footer-socials">
          <a
            href="https://github.com/Geo222222"
            target="_blank"
            rel="noreferrer"
            style={{ background: `${config.primaryColor}15`, color: config.primaryColor }}
          >
            <FaGithub size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/djuvane-martin-48116766/"
            target="_blank"
            rel="noreferrer"
            style={{ background: `${config.primaryColor}15`, color: config.primaryColor }}
          >
            <FaLinkedin size={22} />
          </a>
          <a
            href={`mailto:${config.email}`}
            style={{ background: `${config.primaryColor}15`, color: config.primaryColor }}
          >
            <FaEnvelope size={22} />
          </a>
        </div>

        {/* App-Specific Branding */}
        <div className="footer-branding">
          <h3 className="footer-title" style={{ background: config.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {config.title}
          </h3>
          <p className="footer-subtitle">{config.subtitle}</p>
          <p className="footer-tagline">{config.tagline}</p>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <a href="/privacy.html" target="_blank" rel="noreferrer">Privacy Policy</a>
          <a href="/terms.html" target="_blank" rel="noreferrer">Terms of Service</a>
          <a href={`mailto:${config.email}`}>Contact</a>
        </div>

        {/* Copyright and Special Note */}
        <div className="footer-bottom">
          <p className="copyright">&copy; 2025 {config.title} | {config.specialNote}</p>
        </div>
      </div>
    </footer>
  );
};

export default SharedFooter;
