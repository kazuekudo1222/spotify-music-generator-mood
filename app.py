from flask import Flask, request, jsonify
from transformers import pipeline  # for Zero-shot classification
from ytmusicapi import YTMusic

# Initialize Flask app
app = Flask(__name__)

# Initialize models
zero_shot_classifier = pipeline("zero-shot-classification")
ytmusic = YTMusic()  # No headers.json required

# Define candidate labels for sentiment analysis
candidate_labels = ["happy", "focused", "sad", "tired", "sleepy", "frustrated", "inspired"]

# Map sentiment to desired mood
def map_sentiment_to_mood(sentiment_label):
    mood_mapping = {
        "happy": "energetic",
        "focused": "concentration",
        "sad": "melancholy",
        "tired": "calm",
        "sleepy": "relaxing",
        "frustrated": "stress relief",
        "inspired": "motivational",
    }
    return mood_mapping.get(sentiment_label, "uplifting")  # Default mood

# Search for tracks with URLs
def search_tracks_with_urls(query, limit=10):
    results = ytmusic.search(query, filter="songs", limit=limit)
    tracks_info = []
    for track in results[:limit]:
        title = track.get("title", "Unknown Title")
        artist = track["artists"][0]["name"] if "artists" in track and track["artists"] else "Unknown Artist"
        video_id = track.get("videoId", "")
        url = f"https://music.youtube.com/watch?v={video_id}"
        tracks_info.append({"title": title, "artist": artist, "url": url})
    return tracks_info

# Define API route
@app.route("/suggest-music", methods=["POST"])
def suggest_music():
    try:
        # Get input text from request JSON
        data = request.json
        text = data.get("text", "").strip()
        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Perform sentiment analysis
        result = zero_shot_classifier(text, candidate_labels)
        top_label = max(result["labels"], key=lambda label: result["scores"][result["labels"].index(label)])

        # Map sentiment to mood
        desired_mood = map_sentiment_to_mood(top_label)

        # Search for music tracks
        tracks = search_tracks_with_urls(desired_mood)

        # Return response
        return jsonify({
            "text": text,
            "sentiment": top_label,
            "mood": desired_mood,
            "songs": tracks
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app at local http://127.0.0.1
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=3001, debug=True)
