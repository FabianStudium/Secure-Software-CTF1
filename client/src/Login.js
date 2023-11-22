import React, { useState } from "react";
import axios from "axios";

function Login() {
	const [login, setLogin] = useState("");
	// const [email, setEmail] = useState('');
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage(''); // Clear any existing error messages
		try {
			const response = await axios.post('http://localhost:3000/login', { login, password });
	
			if (response.data.username) {
				localStorage.setItem('username', response.data.username);
				setErrorMessage(response.data.message);
				
				console.log(`User logged in as ${response.data.username}`);
				window.location.href = '/home';
			}
		} catch (error) {
			if (error.response) {
				// Set the error message from the server
				console.log("2")
				console.log(error.response.data)
				setErrorMessage(error.response.data.message);
			} else {
				// Set a generic error message
				console.log("3")
				setErrorMessage('An error occurred. Please try again.');
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
		<input
			type="text"
			value={login}
			onChange={(e) => setLogin(e.target.value)}
			placeholder="Username or Email"
		/>
		{/* <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /> */}
		<input
			type="password"
			value={password}
			onChange={(e) => setPassword(e.target.value)}
			placeholder="Password"
		/>
		<button type="submit">Login</button>
		{errorMessage && <div className="error-message">{errorMessage}</div>}
		</form>
	);
}

export default Login;
