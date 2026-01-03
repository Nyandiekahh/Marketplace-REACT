import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adsService } from '../../services/ads';
import { categoriesService } from '../../services/categories';
import Input from '../common/Input';
import Button from '../common/Button';
import ImageUpload from './ImageUpload';
import { AD_CONDITIONS } from '../../utils/constants';
import { toast } from 'react-toastify';
import './CreateAd.css';

const CreateAd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'KES',
    condition: 'used',
    category_id: '',
    is_negotiable: true,
    city: '',
    county: '',
    country: 'Kenya',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key !== 'country') { // Skip country as it's in location_data
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach((image) => {
        formDataToSend.append('uploaded_images', image);
      });

      // Add location data
      formDataToSend.append('location_data', JSON.stringify({
        city: formData.city,
        county: formData.county,
        country: formData.country,
      }));

      const result = await adsService.createAd(formDataToSend);
      toast.success('Ad posted successfully!');
      navigate(`/ads/${result.slug}`);
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach((key) => {
          const message = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
          toast.error(`${key}: ${message}`);
        });
      } else {
        toast.error('Failed to post ad');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ad-container">
      <div className="create-ad-header">
        <h1>Post Your Ad</h1>
        <p>Fill in the details below to list your item</p>
      </div>

      <form onSubmit={handleSubmit} className="create-ad-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <Input
            type="text"
            name="title"
            label="Title"
            placeholder="e.g., iPhone 13 Pro Max 256GB"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />

          <div className="form-field">
            <label className="input-label">
              Description <span className="input-required">*</span>
            </label>
            <textarea
              name="description"
              className="input"
              placeholder="Describe your item in detail..."
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="input-label">
                Category <span className="input-required">*</span>
              </label>
              <select
                name="category_id"
                className="input"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="input-label">
                Condition <span className="input-required">*</span>
              </label>
              <select
                name="condition"
                className="input"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                {AD_CONDITIONS.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Pricing</h2>
          
          <div className="form-row">
            <Input
              type="number"
              name="price"
              label="Price"
              placeholder="75000"
              value={formData.price}
              onChange={handleChange}
              required
              fullWidth
            />

            <div className="form-field">
              <label className="input-label">Currency</label>
              <select
                name="currency"
                className="input"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="KES">KES (Kenyan Shilling)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>
          </div>

          <div className="checkbox-field">
            <input
              type="checkbox"
              id="is_negotiable"
              name="is_negotiable"
              checked={formData.is_negotiable}
              onChange={handleChange}
            />
            <label htmlFor="is_negotiable">Price is negotiable</label>
          </div>
        </div>

        <div className="form-section">
          <h2>Location</h2>
          
          <div className="form-row">
            <Input
              type="text"
              name="city"
              label="City"
              placeholder="Nairobi"
              value={formData.city}
              onChange={handleChange}
              required
              fullWidth
            />

            <Input
              type="text"
              name="county"
              label="County"
              placeholder="Nairobi"
              value={formData.county}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Images</h2>
          <p className="form-section-subtitle">
            Upload up to 5 images. First image will be the main photo.
          </p>
          
          <ImageUpload images={images} setImages={setImages} maxImages={5} />
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Publish Ad
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAd;
