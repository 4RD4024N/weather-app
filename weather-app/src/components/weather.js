import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloudSun, faCloud, faCloudShowersHeavy, faCloudRain, faBolt, faSnowflake, faSmog } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import './weather.css';

library.add(faSun, faCloudSun, faCloud, faCloudShowersHeavy, faCloudRain, faBolt, faSnowflake, faSmog);

const Weather = () => {
  const { weather, cityInfo } = useSelector((state) => state.weather);
  const [activeDay, setActiveDay] = useState(null);

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

  const toggleDay = (day) => {
    setActiveDay(activeDay === day ? null : day);
  };

  const groupWeatherByDays = (list) => {
    const grouped = list.reduce((acc, forecast) => {
      const date = forecast.dt_txt.split(' ')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(forecast);
      return acc;
    }, {});
    return grouped;
  };

  const dailyWeather = weather ? groupWeatherByDays(weather.list) : {};

  return (
    <div className="weather-container">
      {weather && (
        <div id="weather">
          <h2>{weather.city.name}, {weather.city.country} Hava Durumu</h2>
          <div className="weather-accordion">
            {Object.keys(dailyWeather).map((day, index) => (
              <div key={index} className="weather-day">
                <div className="weather-day-header" onClick={() => toggleDay(day)}>
                  <h3>{formatDate(day)}</h3>
                  <span>{activeDay === day ? '-' : '+'}</span>
                </div>
                <div className={`weather-day-details ${activeDay === day ? 'open' : ''}`}>
                  <table className="weather-table">
                    <thead>
                      <tr>
                        <th>Saat</th>
                        <th>Sıcaklık (°C)</th>
                        <th>Hava Durumu</th>
                        <th>Simge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyWeather[day].map((forecast, index) => (
                        <tr key={index}>
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
              </div>
            ))}
          </div>
        </div>
      )}
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
  );
};

export default Weather;
