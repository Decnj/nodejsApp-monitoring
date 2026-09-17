const express = require('express');
const client = require('prom-client');
const app = express();
const register = client.register;

// Collect default metrics (CPU, memory, event loop lag, etc.)
client.collectDefaultMetrics();

// Create a counter metric
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
});

// Middleware to count requests
app.use((req, res, next) => {
  httpRequestsTotal.inc();
  next();
});

// Simple route
app.get('/', (req, res) => {
  res.send('Welcome to Node.js app');
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log('App running on port 3000');
});
