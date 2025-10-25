// Base path for API - will work both locally and on Netlify
const API_BASE = '/api';

async function testHealth() {
    try {
        showLoading('health-result');
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        document.getElementById('health-result').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById('health-result').textContent = 'Error: ' + error.message;
        console.error('Health check failed:', error);
    }
}

async function createUser() {
    const email = document.getElementById('userEmail').value;
    const name = document.getElementById('userName').value;
    
    if (!email || !name) {
        alert('Please enter both email and name');
        return;
    }
    
    try {
        showLoading('create-result');
        const response = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}&full_name=${encodeURIComponent(name)}`, {
            method: 'POST'
        });
        const data = await response.json();
        document.getElementById('create-result').textContent = JSON.stringify(data, null, 2);
        
        // Clear the user ID field and enable get user
        document.getElementById('userId').value = data.id;
    } catch (error) {
        document.getElementById('create-result').textContent = 'Error: ' + error.message;
        console.error('Create user failed:', error);
    }
}

async function getUser() {
    const userId = document.getElementById('userId').value;
    if (!userId) {
        alert('Please enter a user ID');
        return;
    }
    
    try {
        showLoading('user-result');
        const response = await fetch(`${API_BASE}/users`);
        const data = await response.json();
        
        // Find the specific user
        const user = data.users.find(u => u.id === parseInt(userId));
        if (user) {
            document.getElementById('user-result').textContent = JSON.stringify(user, null, 2);
        } else {
            document.getElementById('user-result').textContent = 'User not found. Available users: ' + JSON.stringify(data.users, null, 2);
        }
    } catch (error) {
        document.getElementById('user-result').textContent = 'Error: ' + error.message;
        console.error('Get user failed:', error);
    }
}

function showLoading(elementId) {
    document.getElementById(elementId).textContent = 'Loading...';
}

// Test the API when page loads
window.addEventListener('load', testHealth);