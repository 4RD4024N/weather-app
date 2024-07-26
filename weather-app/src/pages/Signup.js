import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../Signup.css';
import Navbar from '../components/Navbar';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const gotoLogin=()=>{
    navigate('/login');
  }

  const handleSignup = (e) => {
    e.preventDefault();

    // Retrieve existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Add new user to the list
    const newUser = { name, email, password };
    const updatedUsers = [...existingUsers, newUser];

    // Save updated user list to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setSignupSuccess(true);

    // Redirect to login page after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <>
    <Navbar/>
    <div className="signup-page">
        
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Card className="signup-card">
              <Card.Body>
                <Card.Title className="text-center mb-4">Signup</Card.Title>
                {signupSuccess && (
                  <Alert variant="success" className="text-center">
                    Üyelik başarılı! Giriş sayfasına yönlendiriliyorsunuz...
                  </Alert>
                )}
                <Form onSubmit={handleSignup}>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Name Surname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3 w-100">
                    Signup
                  </Button>
                  <Button variant="primary" onClick={gotoLogin} className="mt-3 w-100">
                    Login page
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </>
  );
};

export default Signup;
