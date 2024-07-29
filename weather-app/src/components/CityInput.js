import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity, setSuggestions, clearError, fetchWeather, fetchCityInfo, setError } from '../weatherSlice';
import { fetchNearbyPlaces, clearSearchResults } from '../searchSlice';
import { debounce } from 'lodash';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import '../CityInput.css';

const CityInput = () => {
  const dispatch = useDispatch();
  const { city, suggestions, error } = useSelector((state) => state.weather);
  const { isNightMode } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.auth);  // Kullanıcı email'ini al
  const searchInputRef = useRef(null);

  const getCitySuggestions = async (input) => {
    const apiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_KEY;
    try {
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
        dispatch(setSuggestions(uniqueSuggestions));
      } else {
        dispatch(setSuggestions([]));
      }
    } catch (error) {
      console.error("API request error:", error);
      dispatch(setError("No city with this name found"));
    }
  };

  const debouncedGetCitySuggestions = useCallback(debounce(getCitySuggestions, 2000), []);

  const handleCityInputChange = (e) => {
    const input = e.target.value;
    dispatch(setCity(input));
    if (input.length > 0) {
      debouncedGetCitySuggestions(input);
    } else {
      dispatch(setSuggestions([]));
    }
    dispatch(clearError());
  };

  const handleSuggestionClick = (suggestion) => {
    const fullCityName = `${suggestion.name}`;
    dispatch(setCity(fullCityName));
    dispatch(setSuggestions([]));
    dispatch(fetchWeather(fullCityName));
    dispatch(fetchCityInfo(fullCityName));
  };

  const handleSearch = () => {
    if (city) {
      dispatch(fetchWeather(city));
      dispatch(fetchCityInfo(city));
    } else {
      dispatch(setError('Lütfen bir şehir adı giriniz.'));
    }
  };

  const handleSearchButtonClick = () => {
    const keyword = searchInputRef.current.value;
    dispatch(fetchNearbyPlaces(keyword));
    saveSearchHistory(city, keyword);
  };

  const handleCloseError = () => {
    dispatch(clearError());
    dispatch(setCity(''));
    dispatch(setSuggestions([]));
  };

  const saveSearchHistory = (city, searchPlace) => {
    if (!currentUser || !currentUser.email) {
      return;
    }
    const currentTime = new Date().toLocaleString();
    const newSearch = { city, searchPlace, time: currentTime };

    let searchHistory = JSON.parse(localStorage.getItem(currentUser.email)) || [];
    searchHistory.push(newSearch);
    localStorage.setItem(currentUser.email, JSON.stringify(searchHistory));
  };

  return (
    <div className={`city-input-container ${isNightMode ? 'night-mode' : ''}`}>
      <input
        type="text"
        className={`infield ${isNightMode ? 'night-mode' : ''}`}
        value={city}
        onChange={handleCityInputChange}
        placeholder="Şehir adı giriniz"
      />
      {suggestions.length > 0 && (
        <ul className={`suggestions-list ${isNightMode ? 'night-mode' : ''}`}>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
      <button className={`but ${isNightMode ? 'night-mode' : ''}`} onClick={handleSearch}>Ara</button>
      <input type='text' ref={searchInputRef} placeholder='Nereyi bulmak istersiniz?' className={`infield ${isNightMode ? 'night-mode' : ''}`} />
      <Button className={`but ${isNightMode ? 'night-mode' : ''}`} onClick={handleSearchButtonClick}>Aranan yerleri Göster</Button>
      <a className={isNightMode ? 'night-mode' : ''} href="https://developers.google.com/maps/documentation/places/web-service/supported_types?hl=tr" target="_blank" rel="noopener noreferrer"> Click for supported keywords to search</a>
      {error && (
        <div className={`error-container ${isNightMode ? 'night-mode' : ''}`}>
          <p className="error">{error}</p>
          <button onClick={handleCloseError}>Kapat</button>
        </div>
      )}
    </div>
  );
};

export default CityInput;
