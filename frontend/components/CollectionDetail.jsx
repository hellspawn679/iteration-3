import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCollectionProducts } from '../utils/shopify';
import ProductGrid from './ProductGrid';
import { ChevronLeft } from 'lucide-react';
import './CollectionDetail.css';

const formatTitle = (handle) => {
  return handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CollectionDetail = () => {
  const { collection } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchCollectionProducts(collection).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [collection]);

  if (loading) {
    return (
      <div className="collection-loading">
        <div className="collection-loading__spinner"></div>
      </div>
    );
  }

  return (
    <div className="collection-detail animate-fade-in">
      <div className="container">
        {/* Back Button */}
        <nav className="collection-breadcrumb">
          <button className="collection-breadcrumb__back" onClick={() => navigate('/')}>
            <ChevronLeft size={14} />
            <span>Back to Shop</span>
          </button>
        </nav>

        {/* Collection Header */}
        <header className="collection-header-section">
          <h1 className="collection-header-title">{formatTitle(collection)}</h1>
          <p className="collection-header-count">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </header>

        {/* Collection Grid */}
        {products.length === 0 ? (
          <div className="collection-empty">
            <p>No products found in this collection.</p>
          </div>
        ) : (
          <ProductGrid 
            products={products} 
            collectionHandle={collection} 
          />
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
