import axios from 'axios';

function Logout() {
    axios.post('http://localhost:3000/logout')
        .then(response => {
            console.log(response.data.message);
            // Clear username from local storage
            localStorage.removeItem('username');
        })
        .catch(error => {
            console.error('Logout failed:', error);
        });
}

export default Logout;