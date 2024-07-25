import React from 'react';
import './App.css';
import Weather from './components/weather';
import CityInput from './components/CityInput';
import Map from './components/Map';
import Navbar from './components/Navbar';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import './share.css';
import { Container, Row, Col } from 'react-bootstrap';
import './Navbar.css';
import './CityInput.css';

const App = () => {
  const { isNightMode } = useSelector((state) => state.theme);

  return (
    <div className={`App ${isNightMode ? 'night-mode' : ''}`}>
      <div className={`navbar ${isNightMode ? 'night-mode ' : ''}`}>
        <Navbar />
      </div>
      <Container fluid className="mt-3">
        <Row>
          <Col md={6} className={`weather-container ${isNightMode ? 'night-mode' : ''}`}>
            <h1>Weather app by Arda Özan</h1>
            
            <Weather />
          </Col>
          <Col md={6} className="map-container">
            <Map />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
