export const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL || 'http://127.0.0.1:8000';

export const AD_CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' }
];

export const AD_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SOLD: 'sold',
  EXPIRED: 'expired'
};

export const ONBOARDING_STEPS = [
  {
    target: '.search-bar',
    title: 'Search for Items',
    content: 'Use the search bar to find items you want to buy. Try searching for "iPhone" or "car".',
    placement: 'bottom'
  },
  {
    target: '.categories-section',
    title: 'Browse Categories',
    content: 'Click on any category to see items in that category.',
    placement: 'bottom'
  },
  {
    target: '.post-ad-btn',
    title: 'Sell Your Items',
    content: 'Click here to post your own ad and start selling!',
    placement: 'left'
  },
  {
    target: '.profile-menu',
    title: 'Your Profile',
    content: 'Access your profile, messages, and saved items here.',
    placement: 'bottom'
  }
];
