import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adsService } from '../services/ads';
import { categoriesService } from '../services/categories';
import SearchBar from '../components/common/SearchBar';
import CategoryCard from '../components/common/CategoryCard';
import AdsList from '../components/ads/AdsList';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [featuredAds, setFeaturedAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [adsData, categoriesData] = await Promise.all([
        adsService.getAds({ page_size: 8 }),
        categoriesService.getCategories(),
      ]);
      
      setFeaturedAds(adsData.results || adsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    navigate(`/ads?search=${query}`);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Buy and Sell Anything<br />in Your Local Area
            </h1>
            <p className="hero-subtitle">
              Find great deals on electronics, vehicles, property, and more
            </p>
            
            <div className="hero-search">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="hero-stats">
              <div className="stat">
                <strong>10,000+</strong>
                <span>Active Ads</span>
              </div>
              <div className="stat">
                <strong>5,000+</strong>
                <span>Happy Users</span>
              </div>
              <div className="stat">
                <strong>100+</strong>
                <span>Categories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse Categories</h2>
            <p>Find what you're looking for</p>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="categories-grid">
              {categories.slice(0, 8).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Recent Ads</h2>
            <p>Check out the latest listings</p>
          </div>

          <AdsList ads={featuredAds} loading={loading} />

          <div className="section-footer">
            <Button onClick={() => navigate('/ads')} variant="outline">
              View All Ads
            </Button>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Sell Something?</h2>
            <p>Post your ad in minutes and reach thousands of buyers</p>
            <Button onClick={() => navigate('/create-ad')} size="large">
              Post Your Ad Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
