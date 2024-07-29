import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import '../Profile.css';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { isNightMode } = useSelector((state) => state.theme);
  const { currentUser, isLoggedIn } = useSelector((state) => state.auth);

  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      const savedHistory = localStorage.getItem(currentUser.email);
      setSearchHistory(savedHistory ? JSON.parse(savedHistory) : []);
    }
  }, [currentUser]);

  const handleClearSearchHistory = () => {
    if (currentUser && currentUser.email) {
      localStorage.removeItem(currentUser.email);
      setSearchHistory([]);
    }
  };

  if (!isLoggedIn) {
    return (
      <Container className={`profile-container ${isNightMode ? 'night-mode' : ''}`}>
        <Row className="justify-content-md-center">
          <Col md="8">
            <div className="profile-header">
              <h2>No user logged in</h2>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container className={`profile-container ${isNightMode ? 'night-mode' : ''}`}>
        <Row className="justify-content-md-center">
          <Col md="8">
            <div className="profile-header">
              <img src={currentUser.avatar || 'https://via.placeholder.com/150'} alt="Avatar" className="profile-avatar" />
              <h2>{currentUser.name}</h2>
              <p>{currentUser.email}</p>
            </div>
            <div className="search-history">
              <h3>Search History</h3>
              <ListGroup>
                {searchHistory.map((search, index) => (
                  <ListGroup.Item key={index} className={isNightMode ? 'night-mode' : ''}>
                    {search.city} - {search.searchPlace} ({search.time})
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="danger" onClick={handleClearSearchHistory} className="mt-3">
                Clear Search History
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
