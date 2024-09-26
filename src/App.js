import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MultiLineChart from './mycomponents/MultiLineChart';
import Login from './mycomponents/Login';  // Import the Login component
import './mycomponents/AxiosConfig';  // Import the Axios config file
import { Routes, Route, useNavigate } from 'react-router-dom';  // Import Routes, Route, and useNavigate

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('token')); // Check token presence on load
  const navigate = useNavigate();  // Hook for navigation

  const fetchData = async () => {
    console.log('fetch data called');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/totalholding/all?angelUserId=IICC19462', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include the token in the headers
        }
      });

      console.log('Fetched data:', response.data);  // Log the fetched data

      const transformedData = response.data.map(item => ({
        name: item.createdAt,
        holdingValue: item.totalholdingvalue,
        profitAndLoss: item.totalprofitandloss,
        pnlPercentage: item.totalpnlpercentage,
        invValue: item.totalinvvalue,
      }));
      
      console.log('Transformed data:', transformedData);  // Log the transformed data

      setData(transformedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);  // Store the error message
      localStorage.removeItem('token');  // Clear token from localStorage

      console.error('Fetch error:', error.message);  // Log the error

      setTimeout(() => {
        navigate('/login');  // Redirect to login page after displaying the error
      }, 5000);  // 3 seconds delay for debugging
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log('Component rendered');
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  // Handle logout by clearing the token and resetting authenticated state
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    //navigate('/login');  // Redirect to login page after logout
  };

  // Function to handle successful login and redirect to home page
  const handleLoginSuccess = () => {
    setAuthenticated(true);  // Update the authenticated state
    // navigate('/login');  // Navigate to the chart page after successful login
  };

  // Function to manually trigger the update API
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/service/portfolio/update', {
        someData: 'someValue',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Update API response:', response.data);  // Log the update API response
      fetchData();
    } catch (error) {
      console.error('Update API error:', error.response ? error.response.data : error.message);
    }
  };
    
  if (!authenticated) {
    console.log('authentication if called');
    return <Login onLogin={handleLoginSuccess} />;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;  // Display the error message before redirecting

  return (
    <Routes>
      <Route path="/dashboard" element={authenticated ? (
        <div className="App">
          <button onClick={handleUpdate}>Update Data</button>  {/* Button to manually call the update API */}
          <button onClick={handleLogout}>Logout</button>
          <MultiLineChart data={data} />
        </div>
      ) : (
        <navigate to="/login" />  // Redirect to login if not authenticated
      )} />
      {/* <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} /> */}
    </Routes>
  );
}

export default App;