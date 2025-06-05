const express = require("express");
const multer = require("multer");
const path = require("path");
const AdminData = require("../models/AdminData");

const router = express.Router();

// ✅ Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure "uploads/" directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// ✅ Add a new movie (Admin Panel) with image upload
router.post("/add", upload.single("poster"), async (req, res) => {
  try {
    const { name, genre, releaseYear, isPublished } = req.body;
    
    if (!name || !genre || !releaseYear) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure a poster file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Movie poster is required" });
    }

    const posterPath = `/uploads/${req.file.filename}`; // Store file path

    const newMovie = new AdminData({
      name,
      genre,
      releaseYear,
      poster: posterPath,
      isPublished: isPublished === "true", // Convert string to boolean
    });

    await newMovie.save();
    res.status(201).json({ message: "Movie added successfully", movie: newMovie });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Get all movies (Supports filtering by genre, releaseYear, rating)
router.get("/", async (req, res) => {
  try {
    let query = {};

    // Filtering conditions
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.releaseYear) query.releaseYear = Number(req.query.releaseYear);
    
    // Fetch movies based on filters
    const movies = await AdminData.find(query);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Get only published movies (for Home Page)
router.get("/published", async (req, res) => {
  try {
    const movies = await AdminData.find({ isPublished: true });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Delete a movie
router.delete("/:id", async (req, res) => {
  try {
    const movie = await AdminData.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
