// DOM Elements
const loginBtn = document.getElementById('spotify-login');
const moodSection = document.getElementById('mood-section');
const generateBtn = document.getElementById('generate-btn');
moodSection.classList.add('hidden');

// Function to change button color
function changeColor(button) {
  button.style.backgroundColor = 'lightblue';
}

// Function to show loading state on the button
function showLoadingState() {
  // Change button text to indicate loading
  generateBtn.innerHTML = 'Loading... <span id="spinner">🔄</span>';

  // Disable the button to prevent multiple clicks
  generateBtn.disabled = true;
}

// Function to reset button after playlist is generated
function resetButton() {
  generateBtn.innerHTML = 'Generate Playlist'; // Reset button text
  generateBtn.disabled = false; // Enable the button
}

//Handle mood input and generate playlist
generateBtn.addEventListener('click', () => {
  const mood = document.getElementById('mood').value.trim();
  if (!mood || mood.length < 3) {
    alert('Please enter a valid mood (at least 3 characters).');
    return;
  }

  // Show loading state
  showLoadingState();

  // Send mood and access token to the backend
  fetch('https://run.mocky.io/v3/3047db8f-6c40-4774-8704-e1b6d5680d23', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mood, access_token: accessToken }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.playlistUrl) {
        window.location.href = data.playlistUrl; // Redirect to Spotify playlist
      } else {
        alert('Failed to generate playlist.');
      }
      resetButton(); // Reset button after action
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      resetButton(); // Reset button on error
    });
});
