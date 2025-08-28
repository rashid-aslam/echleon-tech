const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

let cachedStats = null;
let lastModifiedTime = null;

// Function to calculate stats
function calculateStats(items) {
  return {
    total: items.length,
    averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
  };
}

// Initial load
function loadStats() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw);
    cachedStats = calculateStats(items);
    lastModifiedTime = fs.statSync(DATA_PATH).mtimeMs;
    console.log('Stats loaded and cached.');
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

// Watch for file changes
fs.watch(DATA_PATH, (eventType) => {
  if (eventType === 'change') {
    try {
      const newModifiedTime = fs.statSync(DATA_PATH).mtimeMs;
      if (newModifiedTime !== lastModifiedTime) {
        loadStats();
      }
    } catch (err) {
      console.error('Error watching file:', err);
    }
  }
});

// Load stats at startup
loadStats();

// GET /api/stats
router.get('/', (req, res) => {
  if (cachedStats) {
    res.json(cachedStats);
  } else {
    res.status(503).json({ error: 'Stats not available yet.' });
  }
});

module.exports = router;