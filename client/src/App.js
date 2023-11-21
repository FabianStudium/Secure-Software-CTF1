// import logo from './logo.svg';
import './App.css';

import React from 'react';
import Register from './Register';
import Login from './Login';

function App() {
  const [showLogin, setShowLogin] = React.useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      <h1>Welcome to the Vulnerable App</h1>
      {showLogin ? <Login /> : <Register />}
      <button onClick={toggleForm}>
        {showLogin ? 'Register' : 'Login'}
      </button>
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
