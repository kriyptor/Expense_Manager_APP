import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import Auth from "./components/Auth";
import HomePage from "./components/Homepage";
import ExpenseManagerNavbar from "./components/Navbar";
import ExpenseReport from "./components/ExpenseReport";
import Leaderboard from "./components/Leaderboard";
import axios from 'axios'; 

const App = () => {
  // State to manage authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const apiEndPoint = `http://localhost:3000`/* `http://3.108.236.167` */

  const fetchUserPremiumStatus = async (token) => {
    try {
      const response = await axios.get(`${apiEndPoint}/user/premium-user`, { headers: {"Authorization" : token} });

      setIsPremium(response.data.userIsPremium);
    } catch (error) {
      console.error("Error fetching user premium status:", error);
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          await fetchUserPremiumStatus(storedToken);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
  }, []);

  // Login handler
  const handleLogin = async (token) => {
    try {
      await fetchUserPremiumStatus(token);
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem('token', token); //change to -> localStorage.setItem('token', response.data.token)
    } catch (error) {
      console.error("Login error:", error);
      // Add proper error handling here
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
  };

  if (isLoading) {
    return <Spinner animation="border" /> // Or a proper loading component
  }

  return (
    <Router>
      {/* Navbar only shown when authenticated */}
      {isAuthenticated && 
        <ExpenseManagerNavbar 
          onLogout={handleLogout} 
          isPremium={isPremium} 
          setIsPremium={setIsPremium}
          token={token} // Add userId if needed in navbar
        />
      }
      
      <Routes>
        {/* Default route redirects based on authentication */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Auth handleLogin={handleLogin} />
          } 
        />
        
        {/* Protected Home Route */}
        <Route 
          path="/home" 
          element={
            isAuthenticated ? <HomePage  /> : <Navigate to="/" />
          } 
        />
        
        {/* Protected Expense Report Route */}
        <Route 
          path="/report" 
          element={
            isAuthenticated ? <ExpenseReport isPremium={isPremium} token={token}/> : <Navigate to="/" />
          } 
        />

        {/* Protected Leaderboard Route */}
        <Route 
          path="/leaderboard" 
          element={
            isAuthenticated ? <Leaderboard token={token}/> : <Navigate to="/" />
          } 
        />

        {/* 404 Route */}
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;