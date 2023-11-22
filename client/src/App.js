// import logo from './logo.svg';
import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import AdminPanel from './AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const isAdmin = localStorage.getItem('username') === 'AliceAdminAccount';

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('register')}>Register</button>
        <button onClick={() => setCurrentPage('login')}>Login</button>
        <button onClick={() => setCurrentPage('admin')}>Admin Panel</button>
      </nav>

      {currentPage === 'home' && <Home />}
      {currentPage === 'register' && <Register />}
      {currentPage === 'login' && <Login />}
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
