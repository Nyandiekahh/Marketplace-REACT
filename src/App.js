import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import OnboardingTour from './components/common/OnboardingTour';

import Home from './pages/Home';
import AdsPage from './pages/AdsPage';
import AdDetailPage from './pages/AdDetailPage';
import CreateAdPage from './pages/CreateAdPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OnboardingProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ads" element={<AdsPage />} />
                <Route path="/ads/:slug" element={<AdDetailPage />} />
                <Route path="/create-ad" element={<CreateAdPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/ads" element={<ProfilePage />} />
                <Route path="/profile/favorites" element={<ProfilePage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
            <Footer />
            <OnboardingTour />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </OnboardingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
