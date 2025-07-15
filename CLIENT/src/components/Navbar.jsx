import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';

const ExpenseManagerNavbar = ({ isPremium, onLogout, setIsPremium }) => {

  const navigate = useNavigate();  
  const [show, setShow] = useState(false);
  const [orderId, setOrderId] = useState("")
  const [cashfree, setCashfree] = useState(null);
  const apiEndPoint = 'http://localhost:3000'

  const [token, setToken] = useState(null);
  

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/'); // Redirect to login page
    }
  };

  useEffect(() => {
    const initializeSDK = async () => {
      const cashfreeInstance = await load({
        mode: "sandbox",
      });
      setCashfree(cashfreeInstance);
    };

    const stoedToken = localStorage.getItem("token");
    if (stoedToken) {
      setToken(stoedToken);
    }
    
    initializeSDK();
  }, []);

  const getSessionId = async () => {
    try {
      
      const res = await axios.post(`${apiEndPoint}/payment/session`, {}, { headers: {"Authorization" : token} });

      if (res.data && res.data.result.payment_session_id && res.data.result.order_id) {
        // Return both sessionId and orderId
        return {
          sessionId: res.data.result.payment_session_id,
          orderId: res.data.result.order_id
        };
      } else {
        console.warn("getSessionId: Missing payment_session_id or order_id in response");
        return null; // Or throw an error
      }
    } catch (error) {
      console.error("getSessionId error:", error);
      return null; // Or throw an error
    }
  };

  const handlePayment = async(e) => {
    e.preventDefault();

    try {
      //setLoading(true);
      const sessionData = await getSessionId();

      if (!sessionData) {
        console.error("handlePayment: Could not get session data");
        alert("Could not initiate payment. Please try again.");
        return;
      }

      const { sessionId, orderId } = sessionData;
      setOrderId(orderId); // Update the state here

      console.log("handlePayment: sessionId =", sessionId, "orderId =", orderId);

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then((result) => {
        if(result.error){
          console.log("User closed the popup or payment error:", result.error);
        }
        if(result.redirect){
          console.log("Payment will be redirected");
        }
        if(result.paymentDetails){
          console.log("Payment completed, checking status");
          console.log("Payment details:", result.paymentDetails);
          console.log('orderId being sent for verification:', orderId);

          axios.post(`${apiEndPoint}/payment/verify`, { orderId },  { headers: {"Authorization" : token} })
            .then((res) => {
              console.log("Verification response:", res);
              setIsPremium(true);
              alert(`Congratulations! You are now a premium user.`);
            })
            .catch((err) => {
              console.error("Verification error:", err);
            });
        }
      });
    } catch (error) {
      console.error("handlePayment error:", error);
      alert("Payment failed. Please try again.");
    }
  };



  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky='top'>
      <Container>
        <Navbar.Brand href="/">Expense Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isPremium ? (
              <Button variant="success" className="me-2">
                <NavDropdown 
                  title="Premium Features" 
                  id="premium-dropdown"
                  show={show}
                  onToggle={(isOpen) => setShow(isOpen)} 
                >
                  <NavDropdown.Item onClick={() => navigate('/leaderboard')}>Leaderboard</NavDropdown.Item>
                </NavDropdown>
              </Button>
            ) : (
              <Button variant="warning" className="me-2" onClick={handlePayment} /* disabled={loading} */>
                Buy Premium
              </Button>
            )}
            <Button variant="light" className="me-2" onClick={() => navigate('/report')}>
              Report
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ExpenseManagerNavbar;