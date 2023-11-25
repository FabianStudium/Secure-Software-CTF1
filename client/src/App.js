// import logo from './logo.svg';
import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Home from './Home';
import AdminPanel from './AdminPanel';
import './App.css'

function App() {
	const [currentPage, setCurrentPage] = useState('home');
	// const isAdmin = localStorage.getItem('username') === 'AliceAdminAccount';
	const isLoggedIn = localStorage.getItem('username') != undefined;
	const isAdmin = localStorage.getItem('username') === 'Admin';

	return (
		<div>
			{isLoggedIn && (
				<nav className='navbar'>
					<button onClick={() => setCurrentPage('home')}>Home</button>
					<button onClick={() => setCurrentPage('logout')}>Logout</button>
					<button onClick={() => setCurrentPage('admin')}>Admin Panel</button>
				</nav>
			)}
			{!isLoggedIn && (
				<nav className='navbar'>
					<button className='navbar-button' onClick={() => setCurrentPage('home')}>Home</button>
					<button className='navbar-button' onClick={() => setCurrentPage('register')}>Register</button>
					<button className='navbar-button' onClick={() => setCurrentPage('login')}>Login</button>
					<button className='navbar-button' onClick={() => setCurrentPage('admin')}>Admin Panel</button>
				</nav>
			)}
			{/* <nav>
				<button onClick={() => setCurrentPage('home')}>Home</button>
				<button onClick={() => setCurrentPage('register')}>Register</button>
				<button onClick={() => setCurrentPage('login')}>Login</button>
				<button onClick={() => setCurrentPage('logout')}>Logout</button>
				<button onClick={() => setCurrentPage('admin')}>Admin Panel</button>
			</nav> */}

			{currentPage === 'home' && <Home />}
			{currentPage === 'register' && <Register />}
			{currentPage === 'login' && <Login />}
			{currentPage === 'logout' && <Logout />}
			{currentPage === 'admin' && isAdmin && <AdminPanel />}
			{currentPage === 'admin' && !isAdmin && <p>Access Denied</p>}
		</div>
	);
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
