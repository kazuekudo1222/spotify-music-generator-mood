// DOM Elements
const loginBtn = document.getElementById('spotify-login');
const moodSection = document.getElementById('mood-section');
const generateBtn = document.getElementById('generate-btn');

// Function to change button color
function changeColor(button) {
  button.style.backgroundColor = 'lightblue';
}
const spinning = document.createElement('div');
// Function to show loading state on the button
function showLoadingState() {
  generateBtn.remove();
  spinning.classList.add('loader');
  moodSection.appendChild(spinning);
}

// Function to reset button after playlist is generated
function resetButton() {
  spinning.remove();
  moodSection.appendChild(generateBtn);
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
  fetch('https://run.mocky.io/v3/1fe67190-1bae-484b-a545-0695441b75fa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mood }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.songs && data.songs.length > 0) {
        displaySongs(data.songs); // Display the songs on the page
        generateBtn.classList.add('hidden');
      } else {
        alert('Failed to retrieve songs.');
      }
      resetButton(); // Reset button after action
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      resetButton(); // Reset button on error
    });
});

// Function to display songs
function displaySongs(songs) {
  // Clear existing content (if any)
  const songListContainer =
    document.getElementById('songList') || document.createElement('div');
  songListContainer.id = 'songList';
  songListContainer.innerHTML = ''; // Clear previous list

  // Create a header for the song list
  const header = document.createElement('h2');
  header.textContent = 'Generated Playlist';
  songListContainer.appendChild(header);

  // Create and populate a list of songs
  const ul = document.createElement('ul');
  songs.forEach((song) => {
    const li = document.createElement('li');
    li.classList.add('song-item');
    li.innerHTML = `<a href="${song.url}" target="_blank">${song.name}</a> by ${song.artist}
`;
    ul.appendChild(li);
  });

  songListContainer.appendChild(ul);

  //clear button
  const clr = document.createElement('button');
  clr.textContent = 'clear search';
  songListContainer.appendChild(clr);
  clr.addEventListener('click', () => {
    songListContainer.remove();
    mood.value = '';
    clr.remove();
    generateBtn.classList.remove('hidden');
  });

  // Append the song list container to the page

  moodSection.appendChild(songListContainer);
}
