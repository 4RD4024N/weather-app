import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);

  const getWeather = async () => {
    if (!city) {
      setError('Lütfen bir şehir adı giriniz.');
      setWeather(null);
      return;
    }

    try {
      const apiKey = 'ff5480cd288658b09a27570b7ab2f601'; // OpenWeatherMap API key
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=tr`
      );

      if (response.data.cod === '200') {
        const dailyData = filterDailyData(response.data.list);
        setWeather({ city: response.data.city, list: dailyData });
        setError(null);
        loadMap(response.data.city.coord.lat, response.data.city.coord.lon);
      } else {
        setError('Hava durumu alınırken bir hata oluştu.');
        setWeather(null);
      }
    } catch (error) {
      console.error(error);
      setError('Hava durumu alınırken bir hata oluştu.');
      setWeather(null);
    }
  };

  const filterDailyData = (data) => {
    const dailyData = data.filter((reading) => 
      reading.dt_txt.includes("12:00:00") || reading.dt_txt.includes("18:00:00"));
    return dailyData;
  };

  const loadMap = (lat, lon) => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBU6jF3qbELVW-7FgBcZNEgh3x4IDNW14M`; // Google Maps API key
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        initializeMap(lat, lon);
      };
    } else {
      initializeMap(lat, lon);
    }
  };

  const initializeMap = (lat, lon) => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: { lat, lng: lon }
    });
    new window.google.maps.Marker({
      position: { lat, lng: lon },
      map: map
    });
    setMap(map);
  };

  return (
    <div className="App">
      <h1>Hava Durumu Uygulaması</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Şehir adı giriniz"
      />
      <button onClick={getWeather}>Ara</button>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="content">
          <div id="weather">
            <h2>{weather.city.name} Hava Durumu</h2>
            <table className="weather-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Saat</th>
                  <th>Sıcaklık (°C)</th>
                  <th>Hava Durumu</th>
                </tr>
              </thead>
              <tbody>
                {weather.list.map((forecast, index) => (
                  <tr key={index}>
                    <td>{forecast.dt_txt.split(' ')[0]}</td>
                    <td>{forecast.dt_txt.split(' ')[1]}</td>
                    <td>{forecast.main.temp}°C</td>
                    <td>{forecast.weather[0].description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="map-container">
            <div id="map"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
