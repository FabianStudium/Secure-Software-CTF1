import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [login, setLogin] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { login, password });
      console.log(response.data.username);

      if (response.data.username) {
        localStorage.setItem('username', response.data.username);
        console.log(response.data.username);
        // Or use a state management solution
      }
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Username or Email" />
      {/* <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /> */}
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
