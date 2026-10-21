const cityInput = document.getElementById("cityInput"); 
const searchBtn = document.getElementById("searchBtn"); 
const statusMsg = document.getElementById("statusMsg"); 
const currentCard = document.getElementById("currentCard"); 
const cityNameEl = document.getElementById("cityName"); 
const tempEl = document.getElementById("temp"); 
const windEl = document.getElementById("wind"); 
const conditionEl = document.getElementById("condition"); 
const forecastBody = document.getElementById("forecastBody"); 
 
// ============================================================ 
// TASK 1 — WEATHER CODE DESCRIPTION 
// ============================================================ 
 
/** 
 * Converts an Open-Meteo WMO weather code into a human-readable weather 
description. 
 */ 
function describeWeatherCode(code) { 
  if (code === 0) { 
    return "Clear sky"; 
  } else if (code >= 1 && code <= 3) { 
    return "Partly cloudy"; 
  } else if (code === 45 || code === 48) { 
    return "Fog"; 
  } else if (code >= 51 && code <= 57) { 
    return "Drizzle"; 
  } else if (code >= 61 && code <= 67) { 
    return "Rain"; 
  } else if (code >= 71 && code <= 77) { 
    return "Snow"; 
  } else if (code >= 80 && code <= 82) { 
    return "Rain showers"; 
  } else if (code >= 95 && code <= 99) { 
    return "Thunderstorm"; 
  } else { 
    return "Unknown"; 
  } 
} 
 
// ============================================================ 
// TASK 2 — STATUS MESSAGE 
// ============================================================ 
 
/** 
 * Displays status or error messages on the screen. 
 */ 
function setStatus(message, isError = false) { 
  statusMsg.textContent = message; 
 
  if (isError) { 
    statusMsg.classList.add("error"); 
  } else { 
    statusMsg.classList.remove("error"); 
  } 
} 
 
// ============================================================ 
// API FUNCTION 1 — GEOCODING 
// ============================================================ 
 
// This function is provided. 
// DO NOT MODIFY the API URL or the fetch logic. 
 
async function geocodeCity(city) { 
  const url = `https://geocoding-api.open
meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`; 
 
  const res = await fetch(url); 
 
  if (!res.ok) { 
    throw new Error("Geocoding request failed"); 
  } 
 
  const data = await res.json(); 
 
  if (!data.results || data.results.length === 0) { 
    throw new Error("City not found — try another name."); 
  } 
 
  return data.results[0]; 
} 
 
// ============================================================ 
// API FUNCTION 2 — WEATHER FORECAST 
// ============================================================ 
 
// This function is provided. 
// DO NOT MODIFY the API URL or fetch logic. 
 
async function fetchForecast(lat, lon) { 
  const url = 
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` + 
    `&current_weather=true` + 
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` 
+ 
    `&timezone=auto`; 
 
  const res = await fetch(url); 
 
  if (!res.ok) { 
    throw new Error("Forecast request failed"); 
  } 
 
  return res.json(); 
} 
 
// ============================================================ 
// TASK 3 — DISPLAY CURRENT WEATHER 
// ============================================================ 
 
/** 
 * Renders current weather data onto the card element. 
 */ 
function renderCurrentWeather(place, weatherData) { 
  const current = weatherData.current_weather; 
 
  // Format city and country (e.g., "Colombo, Sri Lanka") 
  const locationName = place.country ? `${place.name}, ${place.country}` : 
place.name; 
 
  cityNameEl.textContent = locationName; 
  tempEl.textContent = `${current.temperature} °C`; 
  windEl.textContent = `${current.windspeed} km/h`; 
  conditionEl.textContent = describeWeatherCode(current.weathercode); 
 
  // Unhide the current weather card 
  currentCard.classList.remove("hidden"); 
} 
 
// ============================================================ 
// TASK 4 — CREATE THE FORECAST TABLE & STRETCH GOAL 
// ============================================================
 
/** 
 * Builds the 5-day forecast table rows dynamically. 
 */ 
function renderForecastTable(daily) { 
  // Clear any existing rows 
  forecastBody.innerHTML = ""; 
 
  // Loop through daily forecast arrays 
  for (let i = 0; i < daily.time.length; i++) { 
    const row = document.createElement("tr"); 
 
    // STRETCH GOAL — Highlight rainy days 
    if (daily.precipitation_sum[i] > 0) { 
      row.classList.add("rainy"); 
    } 
 
    const date = daily.time[i]; 
    const condition = describeWeatherCode(daily.weathercode[i]); 
    const maxTemp = `${daily.temperature_2m_max[i]} °C`; 
    const minTemp = `${daily.temperature_2m_min[i]} °C`; 
    const precip = `${daily.precipitation_sum[i]} mm`; 
 
    row.innerHTML = ` 
      <td>${date}</td> 
      <td>${condition}</td> 
      <td>${maxTemp}</td> 
      <td>${minTemp}</td> 
      <td>${precip}</td> 
    `; 
 
    forecastBody.appendChild(row); 
  } 
} 
 
// ============================================================ 
// TASK 5 — HANDLE SEARCH 
// ============================================================ 
 
/** 
 * Coordinates fetching and displaying data when search is triggered. 
 */ 
async function handleSearch() { 
  const city = cityInput.value.trim(); 
   // Validate input 
  if (!city) { 
    setStatus("Please type a city name.", true); 
    return; 
  } 
 
  // Reset UI before new request 
  currentCard.classList.add("hidden"); 
  forecastBody.innerHTML = ""; 
  setStatus("Loading…", false); 
 
  try { 
    const place = await geocodeCity(city); 
    const weatherData = await fetchForecast(place.latitude, place.longitude); 
 
    renderCurrentWeather(place, weatherData); 
    renderForecastTable(weatherData.daily); 
 
    // Clear status message on success 
    setStatus(""); 
  } catch (error) { 
    setStatus(error.message, true); 
  } 
} 
 
// ============================================================ 
// TASK 6 — SEARCH BUTTON EVENT 
// ============================================================ 
 
searchBtn.addEventListener("click", handleSearch); 
 
// ============================================================ 
// TASK 7 — ENTER KEY SUPPORT 
// ============================================================ 
 
cityInput.addEventListener("keydown", (e) => { 
  if (e.key === "Enter") { 
    handleSearch(); 
  } 
});