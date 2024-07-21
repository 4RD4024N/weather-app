import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity, setSuggestions, clearError, fetchWeather, fetchCityInfo,setError } from '../weatherSlice';
import { debounce } from 'lodash';
import axios from 'axios';
import '../CityInput.css';

const CityInput = () => {
  const dispatch = useDispatch();
  const { city, suggestions, error } = useSelector((state) => state.weather);

  const getCitySuggestions = async (input) => {
    const apiKey = 'b6162f2b1c4d6995bc1fce721b18a63e';
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

  const handleCloseError = () => {
    dispatch(clearError());
    dispatch(setCity(''));
    dispatch(setSuggestions([]));
  };

  return (
    <div>
      <input
        type="text"
        className="infield"
        value={city}
        onChange={handleCityInputChange}
        placeholder="Şehir adı giriniz"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
      <button className="but" onClick={handleSearch}>Ara</button>
      {error && (
        <div className="error-container">
          <p className="error">{error}</p>
          <button onClick={handleCloseError}>Kapat</button>
        </div>
      )}
    </div>
  );
};

export default CityInput;
