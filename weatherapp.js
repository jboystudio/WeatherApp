const apiKey = '864cc69840664f89cdad16e71add5bf8';  // Your API key

// Function to fetch weather data for the selected city
function getWeather() {
  const cityId = document.getElementById('city').value;

  // Store the last selected city ID in localStorage
  localStorage.setItem('lastCity', cityId);

  fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
      updateTimeEverySecond(data.timezone);  // Update time every second
    })
    .catch(error => {
      document.getElementById('weather').innerHTML = `<p>City data could not be retrieved. Please try again.</p>`;
    });
}

// Function to display weather data
function displayWeather(data) {
  const weatherDiv = document.getElementById('weather');

  // Get the weather icon from the API response
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;  // Weather icon URL

  // Display weather data with icon on top of the city's name
  weatherDiv.innerHTML = `
    <img src="${iconUrl}" alt="Weather icon" class="weather-icon">
    <h2>${data.name}</h2>
    <p class="current-temp">${data.main.temp}°C</p>
    <p class="weather-description">${data.weather[0].description}</p>
    <p>Wind: ${data.wind.speed} m/s | Humidity: ${data.main.humidity}%</p>
    <p>Feels like: ${data.main.feels_like}°C</p>
  `;
}

// Function to update and display time every second for the selected city
function updateTimeEverySecond(timezoneOffset) {
  let timeDiv = document.getElementById('local-time');
  if (!timeDiv) {
    timeDiv = document.createElement('p');
    timeDiv.id = 'local-time';
    document.getElementById('weather').appendChild(timeDiv);
  }

  function updateCityTime() {
    const currentTime = new Date();
    const cityTime = new Date(currentTime.getTime() + timezoneOffset * 1000);
    const hours = cityTime.getUTCHours();
    const minutes = cityTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = cityTime.getUTCSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes}:${seconds} ${ampm}`;

    timeDiv.innerText = `Local Time: ${formattedTime}`;
  }

  setInterval(updateCityTime, 1000);
}

// Load the last selected city when the page is loaded
function loadLastCity() {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    document.getElementById('city').value = lastCity;
    getWeather();  // Fetch weather data for the last selected city
  }
}

// Load the last selected city on page load
window.onload = loadLastCity;
