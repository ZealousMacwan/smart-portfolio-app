import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [clientcode, setclientcode] = useState('');
  const [password, setPassword] = useState('');
  const [totp, settotp] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        clientcode,
        password,
        totp,
      });

      // Debug: Log the full response
      //console.log('Server response:', response);

    
      // Assuming the response contains the JWT token
      const token = response.data.data.jwtToken;

      //console.log('token',token);
      localStorage.setItem('token', token); // Store token in localStorage
      onLogin();
    } catch (error) {
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
          onChange={(e) => setclientcode(e.target.value)}
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
          onChange={(e) => settotp(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;