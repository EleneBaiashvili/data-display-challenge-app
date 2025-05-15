
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ data: "" }), 'utf8');
}

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// POST endpoint to receive data
app.post('/api/create-answer', (req, res) => {
  try {
    const { data } = req.body;
    
    if (data === undefined) {
      return res.status(400).json({ error: 'Missing "data" field in request body' });
    }
    
    // Save data to file
    fs.writeFileSync(DATA_FILE, JSON.stringify({ data }), 'utf8');
    
    console.log('Data received and saved:', data);
    return res.status(201).json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    return res.status(500).json({ error: 'Failed to save data' });
  }
});

// GET endpoint to retrieve the most recent data
app.get('/api/get-answer', (req, res) => {
  try {
    // Read data from file
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    const parsedData = JSON.parse(fileData);
    
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error retrieving data:', error);
    return res.status(500).json({ error: 'Failed to retrieve data', data: "" });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
