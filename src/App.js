import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MultiLineChart from './mycomponents/MultiLineChart';
import Login from './mycomponents/Login';  // Import the Login component
import './mycomponents/AxiosConfig';  // Import the Axios config file

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/totalholding/all?angelUserId=IICC19462', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Include the token in the headers
          }
        });

        const transformedData = response.data.map(item => ({
          name: item.createdAt,
          holdingValue: item.totalholdingvalue,
          profitAndLoss: item.totalprofitandloss,
          pnlPercentage: item.totalpnlpercentage,
          invValue: item.totalinvvalue,
        }));
        setData(transformedData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authenticated]);

  // Handle logout by clearing the token and resetting authenticated state
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="App">
      <button onClick={handleLogout}>Logout</button>
      <MultiLineChart data={data} />
    </div>
  );
}

export default App;