const fetch = require('node-fetch');
const WebSocket = require('ws');

class LoadTestClient {
    constructor(serverUrl = 'http://localhost:3000') {
        this.serverUrl = serverUrl;
    }

    async getStatus() {
        try {
            const response = await fetch(`${this.serverUrl}/status`);
            const data = await response.json();
            console.log('Server Status:', data);
            return data;
        } catch (error) {
            console.error('Failed to get status:', error.message);
        }
    }

    async startLoadTest(options = {}) {
        try {
            const response = await fetch(`${this.serverUrl}/start-load`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(options)
            });
            const data = await response.json();
            console.log('Load test started:', data);
            return data;
        } catch (error) {
            console.error('Failed to start load test:', error.message);
        }
    }

    async stopLoadTest() {
        try {
            const response = await fetch(`${this.serverUrl}/stop-load`, {
                method: 'POST'
            });
            const data = await response.json();
            console.log('Load test stopped:', data);
            return data;
        } catch (error) {
            console.error('Failed to stop load test:', error.message);
        }
    }

    createWebSocketLoad(connections = 10) {
        const wsUrl = this.serverUrl.replace('http', 'ws');
        
        for (let i = 0; i < connections; i++) {
            const ws = new WebSocket(wsUrl);
            
            ws.on('open', () => {
                console.log(`WebSocket ${i + 1} connected`);
                
                // Send data every 2 seconds
                setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(`Message from client ${i + 1}: ${Date.now()}`);
                    }
                }, 2000);
            });

            ws.on('message', (data) => {
                console.log(`WebSocket ${i + 1} received:`, data.toString());
            });
        }
    }
}

// Example usage
async function runTest() {
    const client = new LoadTestClient();
    
    // Check status
    await client.getStatus();
    
    // Start load test for 30 seconds
    await client.startLoadTest({
        cpu: true,
        memory: true,
        network: true,
        duration: 30000
    });
    
    // Create additional WebSocket load
    client.createWebSocketLoad(5);
    
    // Check status after 15 seconds
    setTimeout(async () => {
        await client.getStatus();
    }, 15000);
}

// Run if this file is executed directly
if (require.main === module) {
    runTest();
}

module.exports = LoadTestClient;