import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { fetchProduct } from '../utils/shopify';
import './ProductDetail.css';

const formatPrice = (price) => {
  return '₹' + Math.round(price).toLocaleString('en-IN');
};

const ProductDetail = ({ onAddToCart }) => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchProduct(handle).then(data => {
      setProduct(data);
      if (data) {
        setActiveImage(data.images.length > 0 ? data.images[0] : '');
        
        const defaultOptions = {};
        if (data.options) {
          data.options.forEach((opt, idx) => {
            defaultOptions[`option${idx + 1}`] = opt.values[0];
          });
        }
        setSelectedOptions(defaultOptions);
        
        const variant = data.variants.find(v => 
          data.options.every((opt, idx) => v.options[idx] === defaultOptions[`option${idx + 1}`])
        );
        setCurrentVariant(variant || data.variants[0]);
      }
      setLoading(false);
    });
  }, [handle]);

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = { ...selectedOptions, [`option${optionIndex}`]: value };
    setSelectedOptions(newOptions);

    if (product && product.variants) {
      // If the changed option is the Color option, switch gallery to that colour's images
      if (product.colorOptionIdx > 0 && optionIndex === product.colorOptionIdx) {
        const colorImgs = product.colorImageMap?.[value];
        if (colorImgs && colorImgs.length > 0) {
          setActiveImage(colorImgs[0]);
        }
      }

      const variant = product.variants.find(v =>
        product.options.every((opt, idx) => v.options[idx] === newOptions[`option${idx + 1}`])
      );
      if (variant) {
        setCurrentVariant(variant);
        // Only override activeImage from featured_image if no color-map image was set above
        if (variant.featured_image && !(product.colorOptionIdx > 0 && optionIndex === product.colorOptionIdx)) {
          setActiveImage(variant.featured_image);
        }
      } else {
        setCurrentVariant(null);
      }
    }
  };

  const handleAddToCart = () => {
    if (currentVariant && currentVariant.available) {
      onAddToCart({
        id: currentVariant.id,
        name: `${product.name} - ${currentVariant.title}`,
        price: currentVariant.price,
        image: currentVariant.featured_image || activeImage,
        handle: product.handle
      });
    }
  };

  if (loading) {
    return (
      <div className="pdp-loading">
        <div className="pdp-loading__spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-not-found">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Back to Shop
        </button>
      </div>
    );
  }

  const isAvailable = currentVariant ? currentVariant.available : false;
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentCompareAt = currentVariant ? currentVariant.compareAtPrice : product.compareAtPrice;
  const currentDiscount = currentVariant ? currentVariant.discountPercent : product.discountPercent;

  // Determine which images to show in the gallery.
  // If the product has a Color option and the selected color has mapped images,
  // show only that colour's mockups; otherwise show all product images.
  const selectedColor = product.colorOptionIdx > 0
    ? selectedOptions[`option${product.colorOptionIdx}`]
    : null;
  const colorSpecificImages = selectedColor && product.colorImageMap?.[selectedColor];
  const displayImages = (colorSpecificImages && colorSpecificImages.length > 0)
    ? colorSpecificImages
    : product.images;

  return (
    <section className="pdp animate-fade-in">
      <div className="container">
        
        {/* Breadcrumb */}
        <nav className="pdp-breadcrumb">
          <button className="pdp-breadcrumb__back" onClick={() => navigate('/')}>
            <ChevronLeft size={14} />
            <span>Back to collection</span>
          </button>
        </nav>

        <div className="pdp-layout">
          {/* Gallery */}
          <div className="pdp-gallery">
                      {/* Thumbnails on left */}
            {displayImages && displayImages.length > 1 && (
              <div className="pdp-gallery__thumbs">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pdp-gallery__thumb ${activeImage === img ? 'pdp-gallery__thumb--active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
            
                        {/* Main image */}
            <div className="pdp-gallery__main">
              <img src={activeImage || displayImages[0]} alt={product.name} className="pdp-gallery__main-img" />
              
              {currentDiscount && (
                <div className="pdp-gallery__badge">Sale</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="pdp-info">
            <h1 className="pdp-info__title">{product.name}</h1>
            
            {/* Pricing */}
            <div className="pdp-info__pricing">
              {currentCompareAt && currentCompareAt > currentPrice ? (
                <>
                  <span className="pdp-info__price--compare">{formatPrice(currentCompareAt)}</span>
                  <span className="pdp-info__price--sale">{formatPrice(currentPrice)}</span>
                  <span className="pdp-info__price--savings">Save {currentDiscount}%</span>
                </>
              ) : (
                <span className="pdp-info__price">{formatPrice(currentPrice)}</span>
              )}
            </div>

            <p className="pdp-info__tax-note">Tax included. Shipping calculated at checkout.</p>

            {/* Variant Options */}
            {product.options && product.options.map((opt, optIdx) => (
              <div key={opt.name} className="pdp-option">
                <div className="pdp-option__label">
                  {opt.name}: <span className="pdp-option__selected">{selectedOptions[`option${optIdx + 1}`]}</span>
                </div>
                <div className="pdp-option__values">
                  {opt.values.map(val => (
                    <button
                      key={val}
                      className={`pdp-option__btn ${selectedOptions[`option${optIdx + 1}`] === val ? 'pdp-option__btn--active' : ''}`}
                      onClick={() => handleOptionChange(optIdx + 1, val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Add to Cart */}
            <div className="pdp-actions">
              <button 
                className="pdp-actions__atc"
                onClick={handleAddToCart}
                disabled={!isAvailable}
              >
                <ShoppingBag size={18} />
                {!isAvailable ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pdp-description">
                <h3 className="pdp-description__title">Description</h3>
                <div className="pdp-description__content" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* Trust badges */}
            <div className="pdp-trust">
              <div className="pdp-trust__item">
                <span className="pdp-trust__icon">🚚</span>
                <span>Free Shipping on ₹999+</span>
              </div>
              <div className="pdp-trust__item">
                <span className="pdp-trust__icon">↩️</span>
                <span>Easy Returns & Exchange</span>
              </div>
              <div className="pdp-trust__item">
                <span className="pdp-trust__icon">🔒</span>
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
