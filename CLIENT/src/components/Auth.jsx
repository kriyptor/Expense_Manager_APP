import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
 
const AuthComponent = ({ handleLogin }) => {
  const apiEndPoint = 'http://13.232.30.37'
  // State for different forms
  const [key, setKey] = useState('signin');
  
  // Sign In States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Error and Success Message States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validation Functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  // Sign In Handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!signInEmail || !signInPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(signInEmail)) {
      setError('Please enter a valid email address');
      return;
    }


    try {
      console.log('Sign In Attempt', { email: signInEmail });

      const response = await axios.post(`${apiEndPoint}/user/sign-in`, {
        email: signInEmail,
        password: signInPassword
      });

      console.log(response)

      handleLogin(response.data.token); // Update authentication state in parent change to-> localStorage.setItem('token', response.data.token)
      setSuccess('Sign in successful!');
      //navigate('/home'); // Programmatically navigate to home page
    } catch (err) {
      setError('Sign in failed. Please check your credentials.');
    }
  };

  // Sign Up Handler
  const handleSignUp = async(e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation checks
    if (!signUpName || !signUpEmail || !signUpPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }


    if (signUpPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // TODO: Implement actual sign-up logic with backend
    try {
      // Simulated sign-up
      console.log('Sign Up Attempt', { 
        name: signUpName, 
        email: signUpEmail 
      });
        //shivak@12345
      const response = await axios.post(`${apiEndPoint}/user/sign-up`, {
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword
      });

      //console.log(response.data)

      setSuccess('Sign up successful! Please sign in.');
      setKey('signin');
    } catch (err) {
      setError('Sign up failed. Please try again.');
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotEmail) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(forgotEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // TODO: Implement actual forgot password logic with backend
    try {
      // Simulated password reset
      console.log('Password Reset Request', { email: forgotEmail });

      const response = await axios.post(`${apiEndPoint}/password/forgot-password`, {
        emailId: forgotEmail
      });
      
      setSuccess('Password reset link sent to your email!');
    } catch (err) {
      setError('Failed to send password reset link. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              {/* Error/Success Alerts */}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {/* Tabs for different authentication methods */}
              <Tabs
                id="auth-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                {/* Sign In Tab */}
                <Tab eventKey="signin" title="Sign In">
                  <Form onSubmit={handleSignIn}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button variant="primary" type="submit">
                        Sign In
                      </Button>
                      <Button 
                        variant="link" 
                        onClick={() => setKey('forgotpassword')}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                  </Form>
                </Tab>

                {/* Sign Up Tab */}
                <Tab eventKey="signup" title="Sign Up">
                  <Form onSubmit={handleSignUp}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter full name" 
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                      />
                      <Form.Text className="text-muted">
                        Must be 8+ characters, include uppercase, lowercase, and number
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>

                    <Button variant="success" type="submit">
                      Sign Up
                    </Button>
                  </Form>
                </Tab>

                {/* Forgot Password Tab */}
                <Tab eventKey="forgotpassword" title="Forgot Password">
                  <Form onSubmit={handleForgotPassword}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                      <Form.Text className="text-muted">
                        We'll send a password reset link to this email
                      </Form.Text>
                    </Form.Group>

                    <Button variant="warning" type="submit">
                      Send Reset Link
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthComponent;