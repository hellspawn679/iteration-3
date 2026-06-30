import React from 'react';
import { Link } from 'react-router-dom';
import { AtSign, Globe, Mail } from 'lucide-react';
import logoDark from '../logo_dark.png';
import logoWhite from '../logo_white.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & About */}
          <div className="footer-col footer-col--brand">
            <div className="footer-logo-wrapper">
              <img src={logoWhite} alt="DARTH" className="footer-logo-img footer-logo-img--white" />
              <img src={logoDark} alt="DARTH" className="footer-logo-img footer-logo-img--dark" />
            </div>
            <p className="footer-about">
              Gothic streetwear for those who dare to stand out. Premium quality, bold designs.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social__link" aria-label="Website">
                <Globe size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="footer-social__link" aria-label="Social">
                <AtSign size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="footer-social__link" aria-label="Email">
                <Mail size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col__title">Quick Links</h4>
            <ul className="footer-col__list">
              <li><a href="/">Home</a></li>
              <li><a href="/#shop">Shop All</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-col">
            <h4 className="footer-col__title">Customer Service</h4>
            <ul className="footer-col__list">
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Return & Exchange</a></li>
              <li><Link to="/pages/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/pages/terms-of-service">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col__title">Get In Touch</h4>
            <ul className="footer-col__list">
              <li><a href="mailto:hello@darth.store">hello@darth.store</a></li>
              <li><span>Mon - Sat, 10am - 6pm</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} DARTH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
