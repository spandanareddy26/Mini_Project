import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const Browse = ({ movies, setMovies, isSignedIn, userEmail }) => {
  const [ratingFilter, setRatingFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [watchlist, setWatchlist] = useState([]);

  // Fetch watchlist on component mount
  useEffect(() => {
    if (isSignedIn) {
      fetchWatchlist();
    }
  }, [isSignedIn]);

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:15400/api/users/watchlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(response.data);
      console.log('Watchlist fetched:', response.data); // Debug log
    } catch (error) {
      console.error('Error fetching watchlist:', error.response?.data || error.message);
    }
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "No reviews";
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  const hasReviewed = (movie) => {
    return movie.reviews.some((review) => review.userEmail === userEmail);
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

      console.log('Toggling watchlist for movieId:', movieId, 'Token:', token); // Debug log

      const movie = movies.find((m) => m._id === movieId);
      if (!movie) {
        alert('Movie not found.');
        return;
      }

      if (isInWatchlist(movieId)) {
        // Optimistic remove
        setWatchlist(watchlist.filter((m) => m._id !== movieId));
        const response = await axios.post(
          'http://localhost:15400/api/users/watchlist/remove',
          { movieId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Remove response:', response.data); // Debug log
      } else {
        // Optimistic add
        setWatchlist([...watchlist, movie]);
        const response = await axios.post(
          'http://localhost:15400/api/users/watchlist/add',
          { movieId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Add response:', response.data); // Debug log
      }
      // Sync with server
      await fetchWatchlist();
    } catch (error) {
      console.error('Error updating watchlist:', error.response?.data || error.message, error.stack);
      // Revert optimistic update on error
      if (isInWatchlist(movieId)) {
        setWatchlist([...watchlist, movieId]);
      } else {
        setWatchlist(watchlist.filter((m) => m._id !== movieId));
      }
      alert(`Failed to update watchlist: ${error.response?.data?.message || error.message}`);
    }
  };

  const uniqueYears = [...new Set(movies.map((movie) => movie.releaseYear))].sort((a, b) => b - a);
  const uniqueGenres = [...new Set(movies.map((movie) => movie.genre))].sort();

  const handleApplyFilters = async () => {
    try {
      const params = {};
      if (ratingFilter) params.rating = ratingFilter;
      if (genreFilter) params.genre = genreFilter;
      if (yearFilter) params.releaseYear = yearFilter;
      if (sortBy) params.sortBy = sortBy;

      const response = await axios.get('http://localhost:15400/api/movies', { params });
      let filtered = response.data;

      if (searchTerm) {
        filtered = filtered.filter(movie =>
          movie.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredMovies(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    handleApplyFilters();
  };

  return (
    <div className="browse-page container py-5">
      <h2 className="text-center mb-4 browse-heading">Browse Movies</h2>

      {/* Filter Section - Inline with Box */}
      <div className="card filter-box mb-5">
        <div className="card-body p-4">
          <h5 className="card-title mb-3 filter-heading">Filter Movies</h5>
          <div className="row g-3 align-items-center">
            {/* Search Bar */}
            <div className="col-md-3 position-relative">
              <input
                type="text"
                className="form-control search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by movie name..."
              />
              {searchTerm && (
                <button
                  className="btn btn-link clear-search-button position-absolute"
                  style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                  onClick={handleClearSearch}
                >
                  ✕
                </button>
              )}
            </div>
            {/* Rating Filter */}
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="">All Ratings</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>{rating}+ Stars</option>
                ))}
              </select>
            </div>
            {/* Genre Filter */}
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                <option value="">All Genres</option>
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            {/* Year Filter */}
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {/* Sort By Filter */}
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="rating">Top Rated</option>
                <option value="releaseYear">Release Year</option>
              </select>
            </div>
            {/* Apply Filters Button */}
            <div className="col-md-1">
              <button
                className="btn btn-primary w-100 apply-button"
                onClick={handleApplyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Cards */}
      {filteredMovies.length > 0 ? (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
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
                <h3 className="movie-title">{movie.name} ({movie.releaseYear})</h3>
                <p><strong>Genre:</strong> {movie.genre}</p>
                <p><strong>Avg Rating:</strong> {getAverageRating(movie.reviews)}</p>
                {isSignedIn && hasReviewed(movie) && (
                  <span className="badge bg-success reviewed-badge">Reviewed</span>
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
        <p className="text-center text-light">No movies match your filters or search.</p>
      )}
    </div>
  );
};

export default Browse;