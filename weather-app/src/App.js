import React, { useEffect, useState,useRef } from 'react';
import './App.css';
import Weather from './components/weather';
import CityInput from './components/CityInput';
import { useSelector } from 'react-redux';

const App = () => {
  const [arama, setArama] = useState('');
  const { weather } = useSelector((state) => state.weather);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markerDetails, setMarkerDetails] = useState({});
  const [placesService, setPlacesService] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (weather && weather.city) {
      loadMap(weather.city.coord.lat, weather.city.coord.lon);
    }
  }, [weather]);

  const loadMap = (lat, lon) => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`; 
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
        zoom: 12,
        center: { lat, lng: lon },
      });
      setMap(newMap);

      const service = new window.google.maps.places.PlacesService(newMap);
      setPlacesService(service);

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

  const removeAllMarkers = () => {
    markers.forEach(({ marker }) => marker.setMap(null));
    setMarkers([]);
    setMarkerDetails({});
  };

  const searchNearbyPlaces = (keyword) => {
    if (!placesService || !map) return;
  
    const request = {
      location: map.getCenter(),
      radius: '5000',
      keyword: keyword,
    };
  
    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
          addPlaceMarker(place);
        });
      }
    });
  };
  

  const addPlaceMarker = (place) => {
    const placeMarker = new window.google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
    });

    const placeInfoWindow = new window.google.maps.InfoWindow({
      content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`,
    });

    placeMarker.addListener('click', () => {
      placeInfoWindow.open(map, placeMarker);
    });

    setMarkers((prevMarkers) => [...prevMarkers, { id: place.place_id, marker: placeMarker, infoWindow: placeInfoWindow }]);
  };
  const handleSearchButtonClick = () => {
    const keyword = searchInputRef.current.value;
    searchNearbyPlaces(keyword);
  };

  return (
    <div className="App">
      <div className="weather-container">
        <h1>Weather app by Arda Özan</h1>
        <CityInput />
        <input ref={searchInputRef} type='text' placeholder='Nereye gitmek istersiniz?' className='infield'/>
        <button className='but' onClick={handleSearchButtonClick}>Aranan yerleri Göster</button>
        <a href='https://developers.google.com/maps/documentation/places/web-service/supported_types?hl=tr' target='_blank'>          Click for supported keywords to search</a>
        <Weather />
      </div>
      <div className="map-container">
        <div id="map"></div>
        <button onClick={removeAllMarkers} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>Tüm Markerları Kaldır</button>
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