import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, onAddToCart, collectionHandle = 'products' }) => {
  return (
    <section id="shop" className="products-section">
      <div className="container">
        <div className="product-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              collectionHandle={collectionHandle} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
