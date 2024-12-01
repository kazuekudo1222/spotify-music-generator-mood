# Spotify Music Generator 🎵
Generate personalized Spotify playlists based on user moods and activities using sentiment analysis and Spotify's API.

## Features
- **Mood Detection**: Uses AI-powered sentiment analysis to determine the user's mood from a text prompt.
- **Custom Playlists**: Maps moods to music features (valence, energy, tempo, danceability) to fetch tracks tailored to specific moods or activities.
- **Spotify Integration**: Automatically creates and populates Spotify playlists.
- (**Filter by Genre and Artist**: Supports fine-tuning results with additional filters.)

## Getting Started
Follow these instructions to set up and run the project locally.

### Prerequisites
- Python 3.7 or higher.
- Spotify Developer Account. Sign up at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

### Spotify API Setup
Follow these steps to configure your Spotify API credentials:

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Log in with your Spotify account and create a new app.
3. Add the following redirect URI to your app settings:
```bash
http://localhost:8888/callback
```

5. Copy your `Client ID` and `Client Secret` from the app dashboard.
6. Create a `.env` file in the root directory of the project and add the following:
```plaintext
SPOTIPY_CLIENT_ID = your_client_id
SPOTIPY_CLIENT_SECRET = your_client_secret
SPOTIPY_REDIRECT_URI = http://localhost:8888/callback
```

Replace your_client_id and your_client_secret with the values from your Spotify Developer Dashboard.

7. Save the .env file. The application will use these credentials to authenticate with Spotify's API.
