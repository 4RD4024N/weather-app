import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import '../Profile.css';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { isNightMode } = useSelector((state) => state.theme);
  const { email } = useSelector((state) => state.user);  // Kullanıcı email'ini al
  const [editMode, setEditMode] = useState(false);
  const { currentUser } = useSelector((state) => state.theme);
  const [profile, setProfile] = useState(() => {
    
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      avatar: 'https://via.placeholder.com/150',
      name: 'John Doe',
      email: 'john.doe@example.com'
    };
  });
  const [searchHistory, setSearchHistory] = useState(() => {
    const savedHistory = localStorage.getItem(email);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleClearSearchHistory = () => {
    localStorage.removeItem(email);
    setSearchHistory([]);
  };

  return (
    <>
      <Navbar />
      <Container className={`profile-container ${isNightMode ? 'night-mode' : ''}`}>
        <Row className="justify-content-md-center">
          <Col md="8">
            <div className="profile-header">
              <img src={profile.avatar} alt="Avatar" className="profile-avatar" />
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
              {!editMode && <Button className={`but ${isNightMode ? 'night-mode' : ''}`} onClick={handleEditClick}>Edit Profile</Button>}
            </div>
            {editMode && (
              <Form>
                <Form.Group controlId="formAvatar">
                  <Form.Label>Avatar URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter avatar URL"
                    name="avatar"
                    value={profile.avatar}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleSaveClick}>
                  Save
                </Button>
              </Form>
            )}
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
