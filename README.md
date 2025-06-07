# IoT Load Testing Tool

A Node.js application designed for internal load testing that overloads CPU, memory, and network resources on the host server.

## Features

- **CPU Overload**: Creates multiple CPU-intensive tasks using mathematical calculations
- **Memory Overload**: Allocates large memory chunks progressively
- **Network Overload**: Generates HTTP requests and WebSocket connections
- **REST API**: Control load testing via HTTP endpoints
- **WebSocket Support**: Real-time communication and network stress
- **Graceful Shutdown**: Proper cleanup of resources

## Installation

```bash
npm install
```

## Usage

### Start the Server

```bash
npm start
```

The server will start on port 3000 (or PORT environment variable).

### API Endpoints

#### GET /status
Get current system status including memory usage, CPU load, and uptime.

```bash
curl http://localhost:3000/status
```

#### POST /start-load
Start load testing with specified parameters.

```bash
# Start all types of load for 60 seconds
curl -X POST http://localhost:3000/start-load \
  -H "Content-Type: application/json" \
  -d '{"cpu": true, "memory": true, "network": true, "duration": 60000}'

# Start only CPU load for 30 seconds
curl -X POST http://localhost:3000/start-load \
  -H "Content-Type: application/json" \
  -d '{"cpu": true, "memory": false, "network": false, "duration": 30000}'
```

#### POST /stop-load
Stop all running load tests immediately.

```bash
curl -X POST http://localhost:3000/stop-load
```

### Using the Client

Run the test client to automatically start load testing:

```bash
node client-test.js
```

## Load Testing Types

### CPU Load
- Creates multiple worker processes
- Runs intensive mathematical calculations
- Utilizes all available CPU cores

### Memory Load
- Allocates 50MB chunks every second
- Maintains a rolling buffer to prevent complete system crash
- Monitors memory allocation progress

### Network Load
- Sends multiple HTTP requests to external services
- Creates multiple WebSocket connections
- Generates continuous data transfer

## Configuration

You can customize the load testing by modifying the parameters in the `/start-load` endpoint:

- `cpu`: Enable/disable CPU load (boolean)
- `memory`: Enable/disable memory load (boolean)
- `network`: Enable/disable network load (boolean)
- `duration`: Duration in milliseconds (0 for indefinite)

## Safety Notes

⚠️ **Warning**: This tool is designed to overload system resources and should only be used for internal testing purposes.

- Monitor system resources during testing
- Ensure you have proper system monitoring in place
- Use in isolated test environments only
- The tool includes safety mechanisms to prevent complete system crashes

## Monitoring

Monitor your system resources using:

```bash
# CPU and Memory usage
top

# Network connections
netstat -an | grep :3000

# Node.js process memory
node --expose-gc index.js
```

## License

MIT
