import React from 'react';
import { useSelector } from 'react-redux';
import Weather from '../components/weather';
import Map from '../components/Map';
import { Container, Row, Col } from 'react-bootstrap';
import '../App.css';

const HomePage = () => {
  const { isNightMode } = useSelector((state) => state.theme);

  return (
    <Container fluid className={`home-page ${isNightMode ? 'night-mode' : ''} mt-3`}>
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
  );
};

export default HomePage;
