import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adsService } from '../services/ads';
import { categoriesService } from '../services/categories';
import SearchBar from '../components/common/SearchBar';
import AdsList from '../components/ads/AdsList';
import './AdsPage.css';

const AdsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    condition: searchParams.get('condition') || '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadAds();
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadAds = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.price_min) params.price_min = filters.price_min;
      if (filters.price_max) params.price_max = filters.price_max;
      if (filters.condition) params.condition = filters.condition;

      const data = await adsService.getAds(params);
      setAds(data.results || data);
    } catch (error) {
      console.error('Failed to load ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    const newFilters = { ...filters, search: query };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const updateSearchParams = (newFilters) => {
    const params = {};
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        params[key] = newFilters[key];
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      price_min: '',
      price_max: '',
      condition: '',
    };
    setFilters(clearedFilters);
    setSearchParams({});
  };

  return (
    <div className="ads-page">
      <div className="ads-page-header">
        <div className="container">
          <h1>Browse Ads</h1>
          <div className="ads-search">
            <SearchBar onSearch={handleSearch} placeholder="Search ads..." />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="ads-page-content">
          <aside className="ads-sidebar">
            <div className="filter-section">
              <div className="filter-header">
                <h3>Filters</h3>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All
                </button>
              </div>

              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  className="filter-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Condition</label>
                <select
                  className="filter-select"
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                >
                  <option value="">Any Condition</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Price Range (KES)</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    className="filter-input"
                    value={filters.price_min}
                    onChange={(e) => handleFilterChange('price_min', e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="filter-input"
                    value={filters.price_max}
                    onChange={(e) => handleFilterChange('price_max', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="ads-main">
            <div className="ads-results-header">
              <p className="ads-count">
                {loading ? 'Loading...' : `${ads.length} ads found`}
              </p>
            </div>

            <AdsList ads={ads} loading={loading} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdsPage;
