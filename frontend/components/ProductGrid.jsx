import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, onAddToCart, collectionHandle = 'products' }) => {
  return (
    <section id="shop" className="products-section">
      <div className="container">
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              collectionHandle={collectionHandle}
              eager={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
