import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [clientcode, setClientcode] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if token exists on component mount and redirect if so
  useEffect(() => {
    console.log('login component is called')
    const token = localStorage.getItem('token');
      // Only navigate if not already on the login page
      if (window.location.pathname === '/login') {
        navigate('/login');  // Redirect to chart page if user is already logged in
      }
  },);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Clientcode:', clientcode);
    console.log('Password:', password);
    console.log('TOTP:', totp);

    if (!clientcode || !password || !totp) {
      setError('All fields are required.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8080/login', {
        clientcode,
        password,
        totp,
      });

      console.log('Server response:', response.data);  // Log the full response

      // Assuming the response contains the JWT token
      const token = response.data.data.jwtToken;
      console.log('Token:', token);  // Log the token

      localStorage.setItem('token', token); // Store token in localStorage
      onLogin();  // Notify parent component

      // Navigate to the chart page after successful login
      navigate('/dashboard');
            
    } catch (error) {
      console.error('Login error:', error);  // Log the error details
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="clientcode"
          value={clientcode}
          onChange={(e) => setClientcode(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="totp"
          value={totp}
          onChange={(e) => setTotp(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
