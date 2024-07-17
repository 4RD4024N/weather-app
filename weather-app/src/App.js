import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudSun, faCloud, faCloudShowersHeavy, faCloudRain, faBolt, faSnowflake, faSmog } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { debounce } from 'lodash';

library.add(faSun, faCloudSun, faCloud, faCloudShowersHeavy, faCloudRain, faBolt, faSnowflake, faSmog);

const App = () => {

  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);

  const getWeatherData = async (city) => {
    const apiKey = 'YOUR_OPENWEATHERMAP_KEY'; // OpenWeatherMap API key
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          q: city,
          units: 'metric',
          appid: apiKey,
          lang: 'tr'
        }
      }
    );

    if (response.data.cod === '200') {
      return response.data;
    } else {
      throw new Error('Geçersiz şehir adı, lütfen doğru bir şehir adı giriniz.');
    }
  };

  const getCityInfo = async (city) => {
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
      );
      setCityInfo(response.data);
    } catch (error) {
      console.error("Şehir bilgisi alınamadı", error);
      setCityInfo(null);
    }
  };

  const getWeather = async (selectedCity) => {
    if (!selectedCity) {
      setError('Lütfen bir şehir adı giriniz.');
      setWeather(null);
      return; 
    }
    try {
      const data = await getWeatherData(selectedCity);
      const dailyData = filterDailyData(data.list);
      setWeather({ city: data.city, list: dailyData });
      setError(null);
      loadMap(data.city.coord.lat, data.city.coord.lon);
      getCityInfo(selectedCity);
    } catch (error) {
      console.error(error);
      setError("There isn't a city named like this ");
      setWeather(null);
    }
  };

  const filterDailyData = (data) => {
    const dailyData = data.filter((reading) =>
      reading.dt_txt.includes('12:00:00') || reading.dt_txt.includes('18:00:00')
    );
    return dailyData;
  };

  const loadMap = (lat, lon) => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLECLOUD_KEY`; // Google Maps API key
      script.async = true;
      script.onload = () => initializeMap(lat, lon);
      document.head.appendChild(script);
    } else {
      initializeMap(lat, lon);
    }
  };

  const initializeMap = (lat, lon) => {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      const map = new window.google.maps.Map(mapElement, {
        zoom: 8,
        center: { lat, lng: lon },
      });
      new window.google.maps.Marker({
        position: { lat, lng: lon },
        map: map,
      });
      setMap(map);
    }
  };

  const handleCloseError = () => {
    setError(null);
    setCity('');
    setWeather(null);
    setMap(null);
    setCityInfo(null);
  };

  useEffect(() => {
    if (weather && weather.city) {
      loadMap(weather.city.coord.lat, weather.city.coord.lon);
    }
  }, [weather]);

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return faSun;
      case '02d':
      case '02n':
        return faCloudSun;
      case '03d':
      case '03n':
      case '04d':
        return faCloud;
      case '09d':
      case '09n':
        return faCloudShowersHeavy;
      case '10d':
      case '10n':
        return faCloudRain;
      case '11d':
      case '11n':
        return faBolt;
      case '13d':
      case '13n':
        return faSnowflake;
      case '50d':
      case '50n':
        return faSmog;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const getCitySuggestions = async (input) => {
    const apiKey = 'ff5480cd288658b09a27570b7ab2f601'; // OpenWeatherMap API key
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/find`, {
        params: {
          q: input,
          type: 'like',
          sort: 'population',
          cnt: 5,
          appid: apiKey
        }
      }
    );

    if (response.data.cod === '200') {
      const uniqueSuggestions = response.data.list.filter((value, index, self) => 
        index === self.findIndex((t) => (
          t.name === value.name && t.sys.country === value.sys.country
        ))
      );
      setSuggestions(uniqueSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const debouncedGetCitySuggestions = useCallback(debounce(getCitySuggestions, 2000), []);

  const handleCityInputChange = (e) => {
    const input = e.target.value;
    setCity(input);
    if (input.length > 0) {
      debouncedGetCitySuggestions(input);
    } else {
      setSuggestions([]);
    }
    setError(null);
  };

  const handleSuggestionClick = (suggestion) => {
    const fullCityName = `${suggestion.name},${suggestion.sys.country}`;
    setCity(fullCityName);
    setSuggestions([]);
    getWeather(fullCityName);
  };

  return (
    <div className="App">
      <h1>Hava Durumu Uygulaması</h1>
      <input
        type="text"
        value={city}
        onChange={handleCityInputChange}
        placeholder="Şehir adı giriniz"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.name}, {suggestion.sys.country}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => getWeather(city)}>Ara</button>
      {error && (
        <div className="error-container">
          <p className="error">{error}</p>
          <button onClick={handleCloseError}>Kapat</button>
        </div>
      )}
      {weather && (
        <div className="content">
          <div id="weather">
            <h2>{weather.city.name}, {weather.city.country} Hava Durumu</h2>
            <table className="weather-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Saat</th>
                  <th>Sıcaklık (°C)</th>
                  <th>Hava Durumu</th>
                  <th>Simge</th>
                </tr>
              </thead>
              <tbody>
                {weather.list.map((forecast, index) => (
                  <tr key={index}>
                    <td>{formatDate(forecast.dt_txt.split(' ')[0])}</td>
                    <td>{forecast.dt_txt.split(' ')[1]}</td>
                    <td>{forecast.main.temp}°C</td>
                    <td>{forecast.weather[0].description}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={getWeatherIcon(forecast.weather[0].icon)}
                        className="weather-icon"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="map-container">
            <div id="map"></div>
            {cityInfo && (
              <div className="city-info">
                <h3>{cityInfo.title}</h3>
                <p>{cityInfo.extract}</p>
                {cityInfo.thumbnail && (
                  <img src={cityInfo.thumbnail.source} alt={cityInfo.title} />
                )}
                <a href={cityInfo.content_urls.desktop.page} target="_blank" rel="noopener noreferrer">Wikipedia'da oku</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
