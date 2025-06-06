Movie Rating System

A web-based application built with the MERN stack (MongoDB, Express.js, React, Node.js)
that allows users to browse movies, submit ratings, reviews, and emotion tags (Happy, Sad, Scary, Thrilled, Funny, Romantic),
and view movie details with organized layouts. 
This project was developed as a mini-project to demonstrate full-stack development skills, focusing on user-friendly design and efficient data management.
Table of Contents
Features (#features)

Tech Stack (#tech-stack)

Project Structure (#project-structure)

Installation (#installation)

Usage (#usage)

Screenshots (#screenshots)

Contributing (#contributing)

Features
Browse Movies: View a list of movies with filters for ratings, genres, and years using a responsive search bar and dropdowns.

Submit Reviews: Users can submit a star rating, text review, and an emotion tag for each movie.

Emotion Tags: Choose from predefined emotions (Happy, Sad, Scary, Thrilled, Funny, Romantic) to tag reviews, displayed alongside the review.

Responsive Design: Clean and organized layout using Bootstrap for consistent spacing and alignment.

Dynamic Filtering: Filter movies dynamically with a balanced layout for search bar and dropdowns ("Sort By," "All Ratings," "All Genres," "All Years").

Review Display: Reviews are shown at the bottom of the movie page with proper spacing for readability.

Tech Stack
Frontend: React, Bootstrap

Backend: Node.js, Express.js

Database: MongoDB

Other Tools: Mongoose for MongoDB interaction, npm for package management

Project Structure

movie-rating-system/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Browse.js       # Movie browsing with search and filters
│   │   │   ├── Review.js       # Review submission form with rating and emotion tag
│   │   ├── App.js              # Main React app component
│   │   ├── index.js            # Entry point for React
│   └── package.json
├── server/                     # Node.js/Express backend
│   ├── models/
│   │   ├── Movie.js           # Movie schema with emotion tag support
│   │   ├── Review.js          # Review schema with rating, text, and emotion
│   ├── controllers/
│   │   ├── MovieController.js # API routes for movie and review operations
│   ├── routes/
│   │   ├── movie.js           # Movie-related API endpoints
│   ├── server.js              # Main server file
│   └── package.json
├── README.md                   # Project documentation
└── .gitignore

Installation
Follow these steps to set up the project locally:
Prerequisites
Node.js (v16 or higher)

MongoDB (local or cloud instance, e.g., MongoDB Atlas)

npm or yarn

Steps
Clone the repository:
bash

git clone https://github.com/spandanareddy26/Mini_Project.git
cd movie-rating-system

Install dependencies:
For the backend:
bash

cd server
npm install

For the frontend:
cd client
npm install

Set up environment variables:
Create a .env file in the server/ directory with the following:
env

MONGO_URI=your_mongodb_connection_string
PORT=5000

Run the application:
Start the backend server:
bash

cd server
npm start

Start the frontend (in a new terminal):
bash

cd client
npm start

The app will run on http://localhost:3000 (frontend) and http://localhost:5000 (backend).

Usage
Browse Movies: Navigate to the homepage to view movies. Use the search bar and dropdowns ("Sort By," "All Ratings," "All Genres," "All Years") to filter results.

View Movie Details: Click on a movie to see its description, poster, and existing reviews.

Submit a Review:
On the movie page, select a star rating, choose an emotion tag (Happy, Sad, Scary, Thrilled, Funny, Romantic), and write a review.

Submit the review, which will appear at the bottom of the page with the emotion tag displayed.

Responsive Layout: The UI is styled with Bootstrap, ensuring proper spacing (py-5, mb-5, p-4) and alignment for a clean user experience.

Contributing
Contributions are welcome! To contribute:
Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Make your changes and commit (git commit -m 'Add your feature').

Push to the branch (git push origin feature/your-feature).

Open a pull request.

Please ensure your code follows the project's coding style and includes relevant tests. 
