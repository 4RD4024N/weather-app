import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { setMap } from '../mapSlice';
import '../App.css';

const Map = () => {
  const dispatch = useDispatch();
  const { weather } = useSelector((state) => state.weather);
  const { isNightMode } = useSelector((state) => state.theme);
  const { searchResults } = useSelector((state) => state.search);

  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markerDetails, setMarkerDetails] = useState({});

  useEffect(() => {
    if (weather && weather.city) {
      loadMap(weather.city.coord.lat, weather.city.coord.lon);
    }
  }, [weather]);

  useEffect(() => {
    if (searchResults && mapInstance) {
      clearMarkers(); // Önceki markerları temizle
      searchResults.forEach((place) => {
        addPlaceMarker(place);
      });
    }
  }, [searchResults]);

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
      setMapInstance(newMap);
      dispatch(setMap(newMap));

      newMap.addListener('click', (event) => {
        addMarker(event.latLng, newMap);
      });
    }
  };

  const clearMarkers = () => {
    markers.forEach(({ marker }) => marker.setMap(null));
    setMarkers([]);
  };

  const addMarker = (location, map) => {
    const markerId = Date.now().toString();
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: map,
    });

    const newInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div id="info-window-${markerId}" class="info-window ${isNightMode ? 'night-mode' : ''}">
          <input id="title-${markerId}" class="title ${isNightMode ? 'night-mode' : ''}" type="text" placeholder="Başlık yazınız..." />
          <textarea id="description-${markerId}" class="description ${isNightMode ? 'night-mode' : ''}" placeholder="Açıklama yazınız..."></textarea>
          <button class="btn ${isNightMode ? 'night-mode' : ''}" onclick="window.saveMarkerDetails('${markerId}')">Kaydet</button>
          <button class="btn ${isNightMode ? 'night-mode' : ''}" onclick="window.removeMarker('${markerId}')">Markerı Kaldır</button>
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
        <div id="info-window-${markerId}" class="info-window ${isNightMode ? 'night-mode' : ''} visible">
          <h3>${title}</h3>
          <p>${description}</p>
          <button class="btn ${isNightMode ? 'night-mode' : ''}" onclick="window.removeMarker('${markerId}')">Markerı Kaldır</button>
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
    window.removeMarker = removeMarker;
  }, [markers]);

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
    clearMarkers();
    setMarkerDetails({});
  };

  const addPlaceMarker = (place) => {
    const placeMarker = new window.google.maps.Marker({
      position: place.geometry.location,
      map: mapInstance,
      title: place.name,
    });

    const placeInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="info-window ${isNightMode ? 'night-mode' : ''}">
          <strong class="title ${isNightMode ? 'night-mode' : ''}">${place.name}</strong><br>
          <span class="description ${isNightMode ? 'night-mode' : ''}">${place.vicinity}</span>
        </div>
      `,
    });

    placeMarker.addListener('click', () => {
      placeInfoWindow.open(mapInstance, placeMarker);
    });

    setMarkers((prevMarkers) => [...prevMarkers, { id: place.place_id, marker: placeMarker, infoWindow: placeInfoWindow }]);
  };

  return (
    <div className="map-container">
      <div id="map" style={{ width: '100%', height: '600px' }}></div>
      <Button className={`but ${isNightMode ? 'night-mode' : ''}`} onClick={removeAllMarkers} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>Tüm Markerları Kaldır</Button>
      {markers.map(({ id }) => (
        <div key={id}>
          <Button className="but" id={`save-${id}`} onClick={() => saveMarkerDetails(id)} style={{ display: 'none' }}>Kaydet</Button>
          <Button className='but' id={`remove-${id}`} onClick={() => removeMarker(id)} style={{ display: 'none' }}>Markerı Kaldır</Button>
        </div>
      ))}
    </div>
  );
};

export default Map;
