import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  const apiKey = "b65ff0940dfde6a3283d2d7ccfdd8a17";

  const fetchWeather = async (city) => {
    try {
      setError(null); // Reset error state

      const currentWeatherResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const forecastResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      setCurrentWeather(currentWeatherResponse.data);
      setForecast(forecastResponse.data.list.filter((reading) => reading.dt_txt.includes("12:00:00")));
    } catch (err) {
      setCurrentWeather(null);
      setForecast([]);
      setError("City not found. Please enter a valid city name.");
    }
  };

  const fetchWeatherForCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        setError(null); // Reset error state

        const currentWeatherResponse = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        const forecastResponse = await axios.get(
          `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        setCurrentWeather(currentWeatherResponse.data);
        setForecast(forecastResponse.data.list.filter((reading) => reading.dt_txt.includes("12:00:00")));
      } catch (err) {
        setCurrentWeather(null);
        setForecast([]);
        setError("Unable to fetch weather data. Please try again.");
      }
    });
  };

  useEffect(() => {
    fetchWeatherForCurrentLocation(); // Fetch weather for the user's current location on mount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div className="weather-container">
      <h1>WeatherVerse</h1>
      <form className="weather-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter Location"
        />
        <button type="submit">Get Weather</button>
      </form>

      {error && <div className="weather-error">{error}</div>}

      {currentWeather && (
        <div className="weather-details">
          <h2>Today</h2>
          <h3>{currentWeather.name}</h3>
          <p>Temperature: {currentWeather.main.temp}°C</p>
          <p>Min Temperature: {currentWeather.main.temp_min}°C</p>
          <p>Max Temperature: {currentWeather.main.temp_max}°C</p>
          <p>{currentWeather.weather[0].description}</p>
          <img src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} alt="Weather Icon" />
        </div>
      )}

      <div className="forecast-container">
        {forecast.map((weather, index) => (
          <div key={index} className="forecast-item">
            <h4>{new Date(weather.dt_txt).toLocaleDateString("en-US", { weekday: 'long' })}</h4>
            <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather Icon" />
            <p>{weather.main.temp}°C</p>
          </div>
        ))}
      </div>

      <footer>
        <p>Created by @Suraj Godse</p>
        <a href="https://www.linkedin.com/in/suraj-godse" target="_blank" rel="noopener noreferrer">
          <img src="images/linkedin-logo.png" alt="LinkedIn" />
        </a>
        <a href="https://github.com/surajgodse" target="_blank" rel="noopener noreferrer">
          <img src="images/github-logo.png" alt="GitHub" />
        </a>
      </footer>
    </div>
  );
};

export default Weather;
