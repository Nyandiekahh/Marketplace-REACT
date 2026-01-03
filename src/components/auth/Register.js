import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success('Account created! Please verify your email.');
      navigate('/verify-email');
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join our marketplace today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <Input
              type="text"
              name="first_name"
              label="First Name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              required
              fullWidth
            />

            <Input
              type="text"
              name="last_name"
              label="Last Name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>

          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <Input
            type="text"
            name="username"
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
          />

          <Input
            type="tel"
            name="phone_number"
            label="Phone Number"
            placeholder="+254712345678"
            value={formData.phone_number}
            onChange={handleChange}
            required
            fullWidth
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />

          <Input
            type="password"
            name="password2"
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.password2}
            onChange={handleChange}
            required
            fullWidth
          />

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
