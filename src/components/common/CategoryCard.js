import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ads?category=${category.slug}`);
  };

  return (
    <div className="category-card" onClick={handleClick}>
      {category.icon && (
        <div className="category-icon">{category.icon}</div>
      )}
      <h3 className="category-name">{category.name}</h3>
      {category.ad_count !== undefined && (
        <p className="category-count">{category.ad_count} ads</p>
      )}
    </div>
  );
};

export default CategoryCard;
