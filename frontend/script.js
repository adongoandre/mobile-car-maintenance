// Netlify automatically serves our API at the same domain
// So we can use relative paths
const API_BASE = '/api';

async function testHealth() {
    try {
        showLoading('health-result');
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        document.getElementById('health-result').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById('health-result').textContent = 'Error: ' + error.message;
    }
}

async function createUser() {
    const email = document.getElementById('userEmail').value;
    const name = document.getElementById('userName').value;
    
    try {
        showLoading('create-result');
        const response = await fetch(`${API_BASE}/users/?email=${encodeURIComponent(email)}&full_name=${encodeURIComponent(name)}`, {
            method: 'POST'
        });
        const data = await response.json();
        document.getElementById('create-result').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById('create-result').textContent = 'Error: ' + error.message;
    }
}

async function getUser() {
    const userId = document.getElementById('userId').value;
    try {
        showLoading('user-result');
        const response = await fetch(`${API_BASE}/users/${userId}`);
        const data = await response.json();
        document.getElementById('user-result').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById('user-result').textContent = 'Error: ' + error.message;
    }
}

function showLoading(elementId) {
    document.getElementById(elementId).textContent = 'Loading...';
}