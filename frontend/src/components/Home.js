import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = ({ movies, userEmail, isSignedIn }) => {
  const [watchlist, setWatchlist] = useState([]);

  // Fetch watchlist on component mount
  useEffect(() => {
    if (isSignedIn) {
      const fetchWatchlist = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:15400/api/users/watchlist', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWatchlist(response.data);
        } catch (error) {
          console.error('Error fetching watchlist:', error.response?.data || error.message);
        }
      };
      fetchWatchlist();
    }
  }, [isSignedIn]);

  const hasReviewed = (movie) => {
    return movie.reviews.some(review => review.userEmail === userEmail);
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((movie) => movie._id === movieId);
  };

  const handleToggleWatchlist = async (movieId) => {
    if (!isSignedIn) {
      alert('Please sign in to manage your watchlist.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No authentication token found. Please sign in again.');
        return;
      }

      const movie = movies.find((m) => m._id === movieId);
      if (!movie) {
        alert('Movie not found.');
        return;
      }

      if (isInWatchlist(movieId)) {
        setWatchlist(watchlist.filter((m) => m._id !== movieId));
        await axios.post(
          'http://localhost:15400/api/users/watchlist/remove',
          { movieId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        setWatchlist([...watchlist, movie]);
        await axios.post(
          'http://localhost:15400/api/users/watchlist/add',
          { movieId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      // Sync with server
      const response = await axios.get('http://localhost:15400/api/users/watchlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(response.data);
    } catch (error) {
      console.error('Error updating watchlist:', error.response?.data || error.message);
      if (isInWatchlist(movieId)) {
        setWatchlist([...watchlist, movieId]);
      } else {
        setWatchlist(watchlist.filter((m) => m._id !== movieId));
      }
      alert(`Failed to update watchlist: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to PopcornTimes</h1>
        <p>Discover, Rate, and Review Your Favorite Movies!</p>
        <div className="hero-buttons">
          <Link to="/browse" className="hero-button browse-button">Browse Movies</Link>
          {!isSignedIn && (
            <Link to="/signup" className="hero-button signup-button">Sign Up Now</Link>
          )}
        </div>
      </div>
      <div className="movie-section">
        <h2>Featured Movies</h2>
        {movies.length > 0 ? (
          <div className="movie-grid">
            {movies.map((movie) => (
              <div key={movie._id} className="movie-card" style={{ position: 'relative' }}>
                <Link to={`/review/${movie._id}`} className="movie-poster-wrapper">
                  <img
                    src={
                      movie.poster
                        ? movie.poster.startsWith("http")
                          ? movie.poster
                          : `http://localhost:15400/${movie.poster}`
                        : "/default-poster.jpg"
                    }
                    alt={`${movie.name} poster`}
                    className="movie-poster"
                  />
                  <div className="movie-overlay">
                    <span>View Details</span>
                  </div>
                </Link>
                <div className="movie-details">
                  <h3>{movie.name} ({movie.releaseYear})</h3>
                  <p><strong>Genre:</strong> {movie.genre}</p>
                  {isSignedIn && hasReviewed(movie) && (
                    <span className="reviewed-badge">Reviewed</span>
                  )}
                </div>
                {isSignedIn && (
                  <i
                    className={`fas ${isInWatchlist(movie._id) ? 'fa-check text-success' : 'fa-plus text-primary'} watchlist-icon`}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      padding: '5px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      borderRadius: '50%',
                      zIndex: 1,
                    }}
                    onClick={() => handleToggleWatchlist(movie._id)}
                    title={isInWatchlist(movie._id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  ></i>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No movies available. Check back later!</p>
        )}
      </div>
    </div>
  );
};

export default Home;