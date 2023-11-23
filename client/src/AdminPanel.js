import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
		try {
			// const response = await axios.get('http://backend:3000/users'); // Adjust URL as needed
			const response = await axios.get('http://localhost:3000/users'); // Adjust URL as needed
			setUsers(response.data);
		} catch (error) {
			console.error('Error fetching users:', error);
		}
		};

		fetchUsers();
	}, []);

	const handleDelete = async (userId) => {
		try {
		//   await axios.delete(`http://backend:3000/users/${userId}`); // Adjust URL as needed
		  await axios.delete(`http://localhost:3000/users/${userId}`); // Adjust URL as needed
		  setUsers(users.filter(user => user.id !== userId));
		} catch (error) {
		  console.error('Error deleting user:', error);
		}
	};

	return (
		<div>
		<h1>Admin Panel</h1>
		<p>Welcome, Admin!</p>
		<table>
			<thead>
			<tr>
				<th>Username</th>
				<th>Email</th>
				<th>Actions</th>
			</tr>
			</thead>
			<tbody>
			{users.map(user => (
				<tr key={user.id}>
				<td>{user.username}</td>
				<td>{user.email}</td>
				<td>
					{/* Buttons for edit and delete actions */}
					<button onClick={() => console.log("To be developed.")}>Edit</button>
					<button onClick={() => handleDelete(user.id)}>Delete</button>
				</td>
				</tr>
			))}
			</tbody>
		</table>
		</div>
	);
}

export default AdminPanel;
