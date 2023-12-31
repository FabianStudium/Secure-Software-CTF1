import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css'

function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post('http://localhost:3000/register', { username, password, email });
			console.log(response.data);
		} catch (error) {
			console.error('Registration failed:', error);
		}
	};

	return (
		<div className='form-container'>
			<form onSubmit={handleSubmit}>
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
				<button type="submit">Register</button>
			</form>
		</div>
	);
}

export default Register;
