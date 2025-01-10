const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Route to handle mood input
app.post('/suggest-music', async (req, res) => {
  const { mood } = req.body;

  if (!mood || mood.length < 3) {
    return res.status(400).json({ error: 'Invalid mood input' });
  }

  try {
    // Send mood input to Python microservice
    const pythonResponse = await axios.post('http://127.0.0.1:3001/process-mood', { text: mood });
    
    // Respond to the frontend with the processed data
    return res.json(pythonResponse.data);
  } catch (error) {
    console.error('Error communicating with Python microservice:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js server running on http://127.0.0.1:${PORT}`);
});
