import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ContactUs from './components/ContactUs';
import Browse from './components/Browse';
import Admin from './components/Admin';
import Review from './components/Review';
import Profile from './components/Profile';
import Footer from './components/Footer';
import axios from 'axios';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:15400/api/movies/published');
        if (response.data && Array.isArray(response.data)) {
          setMovies(response.data);
        } else {
          console.warn('Unexpected movies data format:', response.data);
          setMovies([]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]); // Fallback to empty array on error
      }
    };
    fetchMovies();

    // Safely parse user data from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user && typeof user === 'object' && user.email) {
          setIsSignedIn(true);
          setUserEmail(user.email);
          setUserFullName(user.fullName || '');
          setIsAdmin(user.role === 'admin');
        } else {
          console.warn('Invalid user data in localStorage:', userData);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsSignedIn(false);
    setIsAdmin(false);
    setUserEmail('');
    setUserFullName('');
  };

  return (
    <div className="App">
      <Router>
        <Navbar isSignedIn={isSignedIn} userEmail={userEmail} handleSignOut={handleSignOut} />
        <main>
          <Routes>
            <Route path="/" element={<Home movies={movies} userEmail={userEmail} isSignedIn={isSignedIn} />} />
            <Route path="/signin" element={<SignIn setIsAdmin={setIsAdmin} setIsSignedIn={setIsSignedIn} setUserEmail={setUserEmail} setUserFullName={setUserFullName} />} />
            <Route path="/signup" element={<SignUp setIsSignedIn={setIsSignedIn} setUserEmail={setUserEmail} setUserFullName={setUserFullName} />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/browse" element={<Browse movies={movies} setMovies={setMovies} isSignedIn={isSignedIn} userEmail={userEmail} />} />
            <Route path="/admin" element={isAdmin ? <Admin setMovies={setMovies} /> : <Navigate to="/signin" />} />
            <Route path="/review/:movieId" element={<Review movies={movies} setMovies={setMovies} isSignedIn={isSignedIn} userEmail={userEmail} userFullName={userFullName} />} />
            <Route path="/profile" element={isSignedIn ? <Profile movies={movies} userEmail={userEmail} userFullName={userFullName} /> : <Navigate to="/signin" />} />
            <Route path="/about" element={<div className="page"><h1>About Us</h1><p>Coming soon...</p></div>} />
            <Route path="/privacy" element={<div className="page"><h1>Privacy Policy</h1><p>Coming soon...</p></div>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;