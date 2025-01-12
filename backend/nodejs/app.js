const express = require('express');
const axios = require('axios');
const cors = require('cors') // Middleware for handling CORS
const jwt = require('jsonwebtoken'); // For decoding Google tokens

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors());  // Enable CORS for all routes

// Route for verifying Google ID Token
app.post('/google-login', async (req, res) => {
  const { idToken } = req.body;
  // Log the received token to verify it's coming through
  console.log('Google token received:', idToken);

  if (!idToken) {
    return res.status(400).json({ error: 'No ID token provided' });
  }

  try {
    // Verify the ID token with Google
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );

    const { email, name, picture } = response.data;

    // Respond with user profile info
    return res.json({
      success: true,
      user: {
        email,
        name,
        picture,
      },
    });
  } catch (error) {
    console.error('Error verifying Google ID Token:', error.message);
    return res.status(401).json({ error: 'Invalid ID token' });
  }
});


// Route for authentication
app.get('/spotify/authenticate', (req, res) => {
  const mockUser = {
    success: true,
    username: 'Test User',
    profilePic: 'https://via.placeholder.com/150',
    accessToken: 'mock_access_token',
  };
  res.json(mockUser);
});

// Route to handle mood input and interact with Python microservice
app.post('/suggest-music', async (req, res) => {
  const { text } = req.body; // Accept `text` input from the frontend

  if (!text || text.length < 3) {
    return res.status(400).json({ error: 'Invalid mood input' });
  }

  try {
    // Send mood input to Python microservice
    const pythonResponse = await axios.post('http://127.0.0.1:3001/suggest-music', { text });
    
    // Extract response data from Python service
    const { sentiment, mood, songs } = pythonResponse.data;

    // Respond to the frontend with the processed data
    // return res.json(pythonResponse.data);

    // Validate Python response structure
    if (!sentiment || !mood || !Array.isArray(songs)) {
    throw new Error('Invalid response from Python service.');
}
    // Respond to the frontend with the processed data
    return res.json({
      text,
      sentiment,
      mood,
      songs,
    });
  } catch (error) {
    console.error('Error communicating with Python microservice:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js server running on http://127.0.0.1:${PORT}`);
});
