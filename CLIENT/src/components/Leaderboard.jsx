import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";


function Leaderboard({ token }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
 const apiEndPoint = 'http://localhost:3000'


  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiEndPoint}/premium/leaderboard`,
        { headers: { "Authorization" : token } }
      );
      setLeaderboard(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <Container className="leaderboard-container mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="leaderboard-content">
            <h2 className="leaderboard-title text-center">Leaderboard</h2>
            {loading ? (
              <p className="loading-text">Loading leaderboard...</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Total Expense</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>₹{user.totalExpense}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Leaderboard;
