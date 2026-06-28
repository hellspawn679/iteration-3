import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CollectionBubbles from './CollectionBubbles';
import ProductCard from './ProductCard';
import { fetchCollectionProducts } from '../utils/shopify';
import './Home.css';

import slide1 from '../front_page1.png';
import slide1Mobile from '../front_page1_mobile.png';
import slide2 from '../front_page2.png';
import slide2Mobile from '../front_page2_mobile.png';

import catOversized from '../goth_category_oversized_1782672438943.png';
import catCargos from '../goth_category_cargos_1782672452829.png';
import catParachute from '../goth_category_parachute_1782672464088.png';
import catShirts from '../essential.png';

const slides = [
  {
    desktopImage: slide1,
    mobileImage: slide1Mobile,
    title: 'DARTH GOTHIC STREETWEAR',
    subtitle: 'UNLEASH THE DARKNESS WITHIN',
    ctaLink: '/pages/urban-style'
  },
  {
    desktopImage: slide2,
    mobileImage: slide2Mobile,
    title: 'OVERSIZED ESSENTIALS',
    subtitle: 'EVERYDAY COMFORT, RE-DEFINED',
    ctaLink: '/pages/essentials'
  }
];

const campaignCards = [
  {
    image: slide1,
    title: 'GOTHIC GRUNGE LOOKBOOK',
    tag: 'EDITORIAL'
  },
  {
    image: slide2,
    title: 'STREET WEAR UTILITY',
    tag: 'STREET'
  },
  {
    image: slide2Mobile,
    title: 'DISPOSABLE FLASH AESTHETICS',
    tag: 'VINTAGE'
  },
  {
    image: catOversized,
    title: 'OVERSIZED INSPIRED REELS',
    tag: 'REELS'
  }
];

const Home = ({ products, onAddToCart }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchCollectionProducts('best-seller')
      .then(data => {
        if (data && data.length > 0) {
          setBestSellers(data.slice(0, 4));
        } else {
          setBestSellers(products ? products.slice(0, 4) : []);
        }
        setLoadingBestSellers(false);
      })
      .catch(err => {
        console.error('Error fetching best sellers collection, falling back:', err);
        setBestSellers(products ? products.slice(0, 4) : []);
        setLoadingBestSellers(false);
      });
  }, [products]);

  const nextSlide = () => {
    setActiveSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="home-page">
      {/* 1. HERO SLIDESHOW BANNER */}
      <section className="hero-slider">
        <div className="hero-slider__track">
          {slides.map((slide, idx) => (
            <div 
              key={idx} 
              className={`hero-slider__slide ${activeSlide === idx ? 'is-active' : ''}`}
              style={{ 
                '--desktop-bg': `url(${slide.desktopImage})`,
                '--mobile-bg': `url(${slide.mobileImage})`
              }}
            >
              <div className="hero-slider__overlay">
                <div className="hero-slider__content container">
                  <h2 className="hero-slider__title">{slide.title}</h2>
                  <p className="hero-slider__subtitle">{slide.subtitle}</p>
                  <div className="hero-slider__actions">
                    <Link to={slide.ctaLink} className="hero-slider__btn hero-slider__btn--primary">SHOP NOW</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <button className="hero-slider__arrow hero-slider__arrow--left" onClick={prevSlide} aria-label="Previous slide">&#10094;</button>
        <button className="hero-slider__arrow hero-slider__arrow--right" onClick={nextSlide} aria-label="Next slide">&#10095;</button>

        {/* Indicators */}
        <div className="hero-slider__dots">
          {slides.map((_, idx) => (
            <button 
              key={idx} 
              className={`hero-slider__dot ${activeSlide === idx ? 'hero-slider__dot--active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. COLLECTION BUBBLES */}
      <CollectionBubbles />

      {/* 3. INFINITE TEXT MARQUEE */}
      <section className="infinite-marquee">
        <div className="infinite-marquee__content">
          <span>★ 10 DAYS RETURN & EXCHANGE ★ FREE SHIPPING ON ORDERS ABOVE ₹999 ★ COD AVAILABLE ★ PREMIUM COMBED COTTON ★ 10 DAYS RETURN & EXCHANGE ★ FREE SHIPPING ON ORDERS ABOVE ₹999 ★ COD AVAILABLE ★ PREMIUM COMBED COTTON ★</span>
          <span>★ 10 DAYS RETURN & EXCHANGE ★ FREE SHIPPING ON ORDERS ABOVE ₹999 ★ COD AVAILABLE ★ PREMIUM COMBED COTTON ★ 10 DAYS RETURN & EXCHANGE ★ FREE SHIPPING ON ORDERS ABOVE ₹999 ★ COD AVAILABLE ★ PREMIUM COMBED COTTON ★</span>
        </div>
      </section>

      {/* 4. ASYMMETRIC MASONRY MOSAIC GRID */}
      <section className="masonry-section container">
        <h3 className="section-title">EXPLORE CATEGORIES</h3>
        <div className="masonry-grid">
          {/* Left Large Card */}
          <div className="masonry-grid__left">
            <Link to="/pages/urban-style" className="masonry-card" style={{ backgroundImage: `url(${catOversized})` }}>
              <div className="masonry-card__overlay">
                <div className="masonry-card__info">
                  <span className="masonry-card__tag">HOT DEALS</span>
                  <h4 className="masonry-card__title">OVERSIZED T-SHIRTS</h4>
                  <span className="masonry-card__link-text">SHOP NOW &rarr;</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Right Cards Stack */}
          <div className="masonry-grid__right">
            {/* Top Landscape Card */}
            <Link to="/pages/urban-style" className="masonry-card masonry-card--landscape" style={{ backgroundImage: `url(${catCargos})` }}>
              <div className="masonry-card__overlay">
                <div className="masonry-card__info">
                  <span className="masonry-card__tag">NEW ARRIVALS</span>
                  <h4 className="masonry-card__title">CARGOS & JOGGERS</h4>
                  <span className="masonry-card__link-text">SHOP NOW &rarr;</span>
                </div>
              </div>
            </Link>
            
            {/* Bottom Two Split Cards */}
            <div className="masonry-grid__bottom">
              <Link to="/pages/urban-style" className="masonry-card" style={{ backgroundImage: `url(${catParachute})` }}>
                <div className="masonry-card__overlay">
                  <div className="masonry-card__info">
                    <span className="masonry-card__tag">UTILITY</span>
                    <h4 className="masonry-card__title">PARACHUTE PANTS</h4>
                    <span className="masonry-card__link-text">EXPLORE &rarr;</span>
                  </div>
                </div>
              </Link>
              
              <Link to="/pages/essentials" className="masonry-card" style={{ backgroundImage: `url(${catShirts})` }}>
                <div className="masonry-card__overlay">
                  <div className="masonry-card__info">
                    <span className="masonry-card__tag">PREMIUM</span>
                    <h4 className="masonry-card__title">ESSENTIAL SHIRTS</h4>
                    <span className="masonry-card__link-text">EXPLORE &rarr;</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS PRODUCT GRID */}
      {bestSellers.length > 0 && (
        <section className="best-sellers container">
          <h3 className="section-title">BEST SELLERS</h3>
          <div className="product-grid">
            {bestSellers.map(prod => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                collectionHandle="all"
              />
            ))}
          </div>
          <div className="best-sellers__footer">
            <Link to="/collections/all" className="view-all-btn">VIEW ALL PRODUCTS</Link>
          </div>
        </section>
      )}

      {/* 6. LOOKBOOK CAMPAIGN CAROUSEL */}
      <section className="lookbook-section container">
        <h3 className="section-title">LOOKBOOK CAMPAIGNS</h3>
        <div className="lookbook-grid">
          {campaignCards.map((card, idx) => (
            <div key={idx} className="lookbook-card" style={{ backgroundImage: `url(${card.image})` }}>
              <div className="lookbook-card__overlay">
                <div className="lookbook-card__info">
                  <span className="lookbook-card__tag">{card.tag}</span>
                  <h4 className="lookbook-card__title">{card.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
