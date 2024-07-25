import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../Profile.css';

const Profile = () => {
  const { isNightMode } = useSelector((state) => state.theme);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'john.doe@example.com'
  });

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    setEditMode(false);
    // Save profile information logic here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  return (
    <Container className={`profile-container ${isNightMode ? 'night-mode' : ''}`}>
      <Row className="justify-content-md-center">
        <Col md="8">
          <div className="profile-header">
            <img src={profile.avatar} alt="Avatar" className="profile-avatar" />
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            {!editMode && <Button className={`but ${isNightMode ? 'night-mode' : ''}`}onClick={handleEditClick}>Edit Profile</Button>}
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
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
