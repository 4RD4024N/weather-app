import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Modal, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../authSlice';
import ForgotPassword from '../components/ForgotPassword';
import '../Login.css';
import Navbar from '../components/Navbar';
import '../CityInput.css'

const Login = () => {
  const { isNightMode } = useSelector((state) => state.theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Retrieve stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(user => user.email === email && user.password === password);

    if (user) {
      setLoginSuccess(true);
      setLoginError(false);
      dispatch(login());

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setLoginError(true);
      setLoginSuccess(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <>
    <Navbar/>
    <div className={`login-page ${isNightMode ? 'night-mode' : ''}`}>
     
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Card className={`login-card ${isNightMode ? 'night-mode' : ''}`}>
              <Card.Body>
                <Card.Title className="text-center mb-4">Login</Card.Title>
                {loginSuccess && (
                  <Alert variant="success" className="text-center">
                    Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...
                  </Alert>
                )}
                {loginError && (
                  <Alert variant="danger" className="text-center">
                    Giriş başarısız! Lütfen bilgilerinizi kontrol ediniz.
                  </Alert>
                )}
                <Form onSubmit={handleLogin}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${isNightMode ? 'night-mode' : ''}`}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${isNightMode ? 'night-mode' : ''}`}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3 w-100">
                    Login
                  </Button>
                  <Button variant="link" className="mt-2 w-100 forgot-password-btn" onClick={handleForgotPassword}>
                    Şifremi Unuttum
                  </Button>
                  <Button variant="link" className="mt-2 w-100 signup-btn" onClick={handleSignup}>
                    Üye Ol
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={showForgotPasswordModal} onHide={handleCloseForgotPasswordModal} centered>
        <ForgotPassword onClose={handleCloseForgotPasswordModal} />
      </Modal>
    </div>
    </>
  );
};

export default Login;
