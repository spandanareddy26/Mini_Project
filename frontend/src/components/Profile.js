import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ movies, userEmail, userFullName }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch watchlist on component mount
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        if (userEmail) {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:15400/api/users/watchlist', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWatchlist(response.data);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [userEmail]);

  // Filter user reviews from movies
  const userReviews = movies
    .map(movie => ({
      movie,
      review: movie.reviews.find(review => review.userEmail === userEmail),
    }))
    .filter(item => item.review);

  return (
    <div className="profile-page container py-5">
      <div className="profile-header text-center mb-4">
        <h2>Profile</h2>
        <h4>Username: {userFullName || 'Not specified'}</h4>
        <p>Email: {userEmail || 'Not specified'}</p>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="profile-section">
            <h5>Your Reviews</h5>
            {loading ? (
              <p>Loading reviews...</p>
            ) : userReviews.length > 0 ? (
              <div>
                {userReviews.map(({ movie, review }, index) => (
                  <div key={index} className="review-item mb-3 p-3 border rounded">
                    <h4>{movie.name} ({movie.releaseYear})</h4>
                    <p><strong>Rating:</strong> {review.rating}/5</p>
                    <p><strong>Comment:</strong> {review.comment || 'No comment'}</p>
                    <p><strong>Emotion:</strong> {review.emotionTag || 'Not specified'}</p>
                    <p><strong>Date:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>You haven't reviewed any movies yet.</p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="profile-section">
            <h5>Your Watchlist</h5>
            {loading ? (
              <p>Loading watchlist...</p>
            ) : watchlist.length > 0 ? (
              <div className="movie-grid">
                {watchlist.map((movie) => (
                  <div key={movie._id} className="movie-card mb-3 p-3 border rounded">
                    <a href={`/review/${movie._id}`} className="text-decoration-none text-dark">
                      <h4>{movie.name} ({movie.releaseYear})</h4>
                      <p><strong>Genre:</strong> {movie.genre}</p>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>Your watchlist is empty.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;