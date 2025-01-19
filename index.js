// DOM Elements
const loginBtn = document.getElementById('google-login');
const moodSection = document.getElementById('mood-section');
const generateBtn = document.getElementById('generate-btn');
moodSection.classList.add('hidden');

// Check if user is already authenticated
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');

// Initialize Google Sign-In
window.onload = function () {
  google.accounts.id.initialize({
    client_id: '340009438838-0mg7mqi32k3dobmbekgtuokrqpmvo7dh.apps.googleusercontent.com', // Replace with your actual Client ID
    callback: handleCredentialResponse,
  });

  google.accounts.id.renderButton(
    document.getElementById('google-login'),
    { theme: 'outline', size: 'large' }
  );
};

// Show/hide elements based on authentication status
if (accessToken) {
  localStorage.setItem('accessToken', accessToken);
  loginBtn.classList.add('hidden'); // Hide the login button after successful login
  moodSection.classList.remove('hidden'); // Show the mood section
} else {
  loginBtn.classList.remove('hidden'); // Show the login button
}

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

// Google Login  // Handle Google Sign-In Response
function handleCredentialResponse(response) {
  const idToken = response.credential; // Google ID Token
// Redirect to backend to initiate Spotify login flow //window.location.href = 'http://your-backend-url.com/spotify/authenticate';

// Simulate login with fetch to mock API// Handle the response from the backend after authentication
  fetch('https://youtube-music-generator-node.onrender.com/google-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  })

    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log('Backend response:', data); // Log the backend response
        //alert('Login successful!');
        moodSection.classList.remove('hidden'); // Show mood section
        loginBtn.classList.add('hidden'); // Hide login button
        const { email, name, picture } = data.user; // Display user profile info

        // Display user profile
        const userProfileContainer = document.createElement('div');
        userProfileContainer.classList.add('user-profile');

        const profileImage = document.createElement('img');
        profileImage.src = picture; // Assuming the API returns `profilePic`
        profileImage.alt = `${name}'s profile picture`;
        profileImage.classList.add('profile-pic'); // Optional styling class

        const profileName = document.createElement('h3');
        profileName.textContent = name; // Assuming the API returns `username`
        profileName.classList.add('profile-name'); // Optional styling class

        userProfileContainer.appendChild(profileImage);
        userProfileContainer.appendChild(profileName);

        const existing = document.querySelector('body');
        existing.insertAdjacentElement('afterbegin', userProfileContainer); // Add to the DOM

        const backgroundColor = document.querySelector('body');
        backgroundColor.classList.add('change-bgColor');

        // Show mood section and hide login button
        moodSection.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        
        //show logout button
        const logOut = document.createElement('button');
        logOut.textContent = 'Log out';
        logOut.classList.add('logout');
        userProfileContainer.appendChild(logOut);
        
        logOut.addEventListener('click', () => {
          signOut();
          // Google Logout Function
          function signOut() {
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');     
            console.log('User signed out.');
              // Remove user profile and show the login button again
              //document.querySelector('.user-profile').remove(); // Remove user profile
              alert('you are logging out');
              window.location.href ='https://youtube-music-mood.onrender.com';
          };

        });
        
      }   else {
        alert(
          'Authentication failed. Please check your credentials and try again.',
        );
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    });
};

// Google Logout Function
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    console.log('User signed out.');
    // Remove user profile and show the login button again
    //document.querySelector('.user-profile').remove(); // Remove user profile
    alert('you are logging out');
    window.location.href ='https://youtube-music-mood.onrender.com/';
  });
}

//Handle mood input and generate playlist. I change your ID from mood to text
generateBtn.addEventListener('click', () => {
  const text = document.getElementById('text').value.trim();
  if (!text || text.length < 3) {
    alert('Please enter a valid mood (at least 3 characters).');
    return;
  }

  // Show loading state
  showLoadingState();

  // Send mood text and access token to the backend. Also updated the input from mood to text and remove the access token
  fetch('https://youtube-music-generator-node.onrender.com/suggest-music', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
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
    li.innerHTML = `<a href="${song.url}" target="_blank">${song.title}</a> by ${song.artist}
`;
    ul.appendChild(li);
  });

  songListContainer.appendChild(ul);

  //clear button
  const clr = document.createElement('button');
  clr.textContent = 'Clear Search';
  songListContainer.appendChild(clr);
  clr.addEventListener('click', () => {
    songListContainer.remove();
    text.value = '';
    clr.remove();
    generateBtn.classList.remove('hidden');
  });

  // Append the song list container to the page
  moodSection.appendChild(songListContainer);
}
