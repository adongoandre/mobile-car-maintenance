import './styles.css';

// Replace with your actual backend URL after deployment
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class APITester {
    constructor() {
        this.appElement = document.getElementById('app');
        this.init();
    }

    init() {
        this.appElement.innerHTML = this.getHTML();
        this.bindEvents();
        this.testConnection();
    }

    getHTML() {
        return `
            <div class="container">
                <div class="header">
                    <h1>🚗 AutoFlex</h1>
                    <p>Car Maintenance Service - API Testing Dashboard</p>
                </div>

                <div class="test-section">
                    <h3>
                        <span class="status-indicator" id="status-indicator"></span>
                        API Connection Test
                    </h3>
                    <div class="flex">
                        <button class="button" onclick="apiTester.testConnection()">Test Connection</button>
                        <span id="connection-status">Click to test API connection</span>
                    </div>
                    <div class="result" id="connection-result"></div>
                </div>

                <div class="test-section">
                    <h3>📊 Health Check</h3>
                    <button class="button" onclick="apiTester.testHealth()">Check API Health</button>
                    <div class="result" id="health-result"></div>
                </div>

                <div class="test-section">
                    <h3>👥 User Management</h3>
                    <div class="flex">
                        <input type="number" class="input" id="userId" placeholder="User ID" value="1">
                        <button class="button" onclick="apiTester.getUser()">Get User</button>
                    </div>
                    <div class="result" id="user-result"></div>
                </div>

                <div class="test-section">
                    <h3>🔧 Service Booking (Example)</h3>
                    <div class="flex">
                        <select class="input" id="serviceType">
                            <option value="wash">Car Wash</option>
                            <option value="oil">Oil Change</option>
                            <option value="tire">Tire Repair</option>
                        </select>
                        <button class="button success" onclick="apiTester.simulateBooking()">Simulate Booking</button>
                    </div>
                    <div class="result" id="booking-result"></div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Event listeners are attached via onclick in HTML for simplicity
    }

    async testConnection() {
        const indicator = document.getElementById('status-indicator');
        const status = document.getElementById('connection-status');
        const result = document.getElementById('connection-result');
        
        indicator.className = 'status-indicator';
        status.textContent = 'Testing connection...';
        result.textContent = '';
        result.className = 'result loading';

        try {
            const response = await fetch(`${API_BASE}/`);
            if (response.ok) {
                const data = await response.json();
                indicator.className = 'status-indicator status-online';
                status.textContent = '✅ API is online and responding';
                result.textContent = JSON.stringify(data, null, 2);
                result.className = 'result success';
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            indicator.className = 'status-indicator status-offline';
            status.textContent = '❌ API connection failed';
            result.textContent = `Error: ${error.message}\n\nMake sure your backend is running at:\n${API_BASE}`;
            result.className = 'result error';
        }
    }

    async testHealth() {
        const result = document.getElementById('health-result');
        result.textContent = 'Testing...';
        result.className = 'result loading';

        try {
            const response = await fetch(`${API_BASE}/health`);
            const data = await response.json();
            result.textContent = JSON.stringify(data, null, 2);
            result.className = 'result success';
        } catch (error) {
            result.textContent = `Error: ${error.message}`;
            result.className = 'result error';
        }
    }

    async getUser() {
        const userId = document.getElementById('userId').value;
        const result = document.getElementById('user-result');
        result.textContent = 'Fetching user...';
        result.className = 'result loading';

        try {
            const response = await fetch(`${API_BASE}/users/${userId}`);
            if (response.status === 404) {
                result.textContent = 'User not found. Try creating a user via your API first.';
                result.className = 'result error';
                return;
            }
            const data = await response.json();
            result.textContent = JSON.stringify(data, null, 2);
            result.className = 'result success';
        } catch (error) {
            result.textContent = `Error: ${error.message}`;
            result.className = 'result error';
        }
    }

    async simulateBooking() {
        const serviceType = document.getElementById('serviceType').value;
        const result = document.getElementById('booking-result');
        result.textContent = 'Simulating booking request...';
        result.className = 'result loading';

        // Simulate API call - you'll replace this with actual endpoint later
        setTimeout(() => {
            const mockResponse = {
                booking_id: Math.floor(Math.random() * 1000),
                service: serviceType,
                status: "confirmed",
                estimated_time: "45 minutes",
                price: serviceType === 'wash' ? 25 : serviceType === 'oil' ? 50 : 35,
                message: "This is a simulation. Implement actual booking endpoint in backend."
            };
            result.textContent = JSON.stringify(mockResponse, null, 2);
            result.className = 'result success';
        }, 1000);
    }
}

// Create environment configuration
const envScript = document.createElement('script');
envScript.type = 'module';
envScript.textContent = `
    console.log('API Base URL:', '${API_BASE}');
`;
document.head.appendChild(envScript);

// Initialize the app
const apiTester = new APITester();