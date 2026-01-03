import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, getTimeAgo, getImageUrl } from '../../utils/helpers';
import { adsService } from '../../services/ads';
import { toast } from 'react-toastify';
import './AdCard.css';

const AdCard = ({ ad, onFavoriteChange }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(ad.is_favorited || false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    navigate(`/ads/${ad.slug}`);
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      if (isFavorite) {
        await adsService.removeFromFavorites(ad.id);
        toast.success('Removed from favorites');
      } else {
        await adsService.addToFavorites(ad.id);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
      if (onFavoriteChange) onFavoriteChange();
    } catch (error) {
      toast.error('Please login to save favorites');
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = ad.primary_image 
    ? getImageUrl(ad.primary_image) 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="ad-card" onClick={handleClick}>
      <div className="ad-card-image-wrapper">
        <img 
          src={imageUrl} 
          alt={ad.title}
          className="ad-card-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        {ad.premium_type && ad.premium_type !== 'basic' && (
          <span className={`ad-badge badge-${ad.premium_type}`}>
            {ad.premium_type.toUpperCase()}
          </span>
        )}
        <button 
          className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
          onClick={handleFavorite}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill={isFavorite ? "currentColor" : "none"}>
            <path 
              d="M10 17.5s7.5-5 7.5-10c0-2.76-2.24-5-5-5-1.74 0-3.26.89-4.16 2.22A4.985 4.985 0 0 0 4.17 2.22C1.74 2.22 0 4.46 0 7.22c0 5 7.5 10 7.5 10z" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <div className="ad-card-content">
        <h3 className="ad-card-title">{ad.title}</h3>
        <p className="ad-card-price">{formatPrice(ad.price, ad.currency)}</p>
        
        <div className="ad-card-meta">
          <span className="ad-card-location">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M11.5 6c0 3.5-4.5 7-4.5 7S2.5 9.5 2.5 6a4.5 4.5 0 0 1 9 0z" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            {ad.location?.city || 'Unknown'}
          </span>
          <span className="ad-card-time">{getTimeAgo(ad.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
