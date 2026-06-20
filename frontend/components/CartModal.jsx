import React, { useState } from 'react';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import './CartModal.css';

const formatPrice = (price) => {
  return '₹' + Math.round(price).toLocaleString('en-IN');
};

const CartModal = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Items are already added to Shopify cart via /cart/add.js API
    // Redirect to native Shopify checkout
    window.location.href = '/checkout';
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Your Cart ({items.length})</h2>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>Your cart is currently empty.</p>
              <button className="btn-outline" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item__image" />
                  <div className="cart-item__details">
                    <h4 className="cart-item__name">{item.name}</h4>
                    <div className="cart-item__price">{formatPrice(item.price)}</div>
                    
                    <div className="cart-item__controls">
                      <div className="cart-item__qty">
                        <button 
                          className="cart-item__qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-item__qty-value">{item.quantity}</span>
                        <button 
                          className="cart-item__qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button className="cart-item__remove" onClick={() => onRemove(item.id)} aria-label="Remove item">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span>Subtotal</span>
              <span className="cart-drawer__subtotal-amount">{formatPrice(total)}</span>
            </div>
            <p className="cart-drawer__shipping-note">Shipping & taxes calculated at checkout</p>
            
            <button 
              className="cart-drawer__checkout" 
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
