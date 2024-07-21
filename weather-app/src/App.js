import React, { useEffect, useState } from 'react';
import './App.css';
import Weather from './components/weather';
import CityInput from './components/CityInput';
import { useSelector } from 'react-redux';

const App = () => {
  const { weather } = useSelector((state) => state.weather);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markerDetails, setMarkerDetails] = useState({});

  useEffect(() => {
    if (weather && weather.city) {
      loadMap(weather.city.coord.lat, weather.city.coord.lon);
    }
  }, [weather]);

  const loadMap = (lat, lon) => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`; // Google Maps API key
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
      const newMap = new window.google.maps.Map(mapElement, {
        zoom: 8,
        center: { lat, lng: lon },
      });
      setMap(newMap);

      // Harita üzerine tıklanabilirlik ekleyin
      newMap.addListener('click', (event) => {
        addMarker(event.latLng, newMap);
      });
    }
  };

  const addMarker = (location, map) => {
    const markerId = Date.now().toString();
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: map,
    });

    const newInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div id="info-window-${markerId}" class="info-window">
          <input id="title-${markerId}" type="text" placeholder="Başlık yazınız..." />
          <textarea id="description-${markerId}" placeholder="Açıklama yazınız..."></textarea>
          <button onclick="document.getElementById('save-${markerId}').click()">Kaydet</button>
          <button onclick="document.getElementById('remove-${markerId}').click()">Markerı Kaldır</button>
        </div>
      `,
    });

    newMarker.addListener('click', () => {
      newInfoWindow.open(map, newMarker);
      setTimeout(() => {
        document.getElementById(`info-window-${markerId}`).classList.add('visible');
      }, 10);
    });

    setMarkers((prevMarkers) => [...prevMarkers, { id: markerId, marker: newMarker, infoWindow: newInfoWindow }]);

    const markerDetail = {
      ...markerDetails,
      [markerId]: { title: '', description: '', infoWindow: newInfoWindow }
    };
    setMarkerDetails(markerDetail);
  };

  const saveMarkerDetails = (markerId) => {
    const title = document.getElementById(`title-${markerId}`).value;
    const description = document.getElementById(`description-${markerId}`).value;

    setMarkerDetails((prevDetails) => {
      const updatedDetails = {
        ...prevDetails,
        [markerId]: {
          ...prevDetails[markerId],
          title: title,
          description: description,
        },
      };

      const newInfoWindowContent = `
        <div id="info-window-${markerId}" class="info-window visible">
          <h3>${title}</h3>
          <p>${description}</p>
          <button onclick="document.getElementById('remove-${markerId}').click()">Markerı Kaldır</button>
        </div>
      `;

      if (prevDetails[markerId] && prevDetails[markerId].infoWindow) {
        prevDetails[markerId].infoWindow.setContent(newInfoWindowContent);
      }

      return updatedDetails;
    });
  };

  useEffect(() => {
    window.saveMarkerDetails = saveMarkerDetails;
  }, []);

  const removeMarker = (markerId) => {
    const markerToRemove = markers.find((m) => m.id === markerId);
    if (markerToRemove) {
      markerToRemove.marker.setMap(null);
      setMarkers((prevMarkers) => prevMarkers.filter((m) => m.id !== markerId));
      setMarkerDetails((prevDetails) => {
        const newDetails = { ...prevDetails };
        delete newDetails[markerId];
        return newDetails;
      });
    }
  };

  return (
    <div className="App">
      <div className="weather-container">
        <h1>Hava Durumu Uygulaması</h1>
        <CityInput />
        <Weather />
      </div>
      <div className="map-container">
        <div id="map" style={{ height: '500px', width: '100%' }}></div>
      </div>
      {markers.map(({ id }) => (
        <div key={id}>
          <button id={`save-${id}`} onClick={() => saveMarkerDetails(id)} style={{ display: 'none' }}>Kaydet</button>
          <button id={`remove-${id}`} onClick={() => removeMarker(id)} style={{ display: 'none' }}>Markerı Kaldır</button>
        </div>
      ))}
    </div>
  );
};

export default App;
