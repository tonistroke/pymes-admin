const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware to verify JWT tokens
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });

    // Add decoded user data to request
    req.user = decoded;
    next();
  });
};

// Proxy options for each microservice
const services = {
  service1: 'http://localhost:3001', // Microservice 1
  service2: 'http://localhost:3002', // Microservice 2
  service3: 'http://localhost:3003', // Microservice 3
  service4: 'http://localhost:3004', // Microservice 4
  service5: 'http://localhost:3005', // Microservice 5
};

// Apply middleware for each route
Object.entries(services).forEach(([path, target]) => {
  app.use(
    `/${path}`,
    authenticate, // Authenticate the request
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^/${path}`]: '' }, // Remove the service prefix
    })
  );
});

// Health check endpoint
app.get('/health', (req, res) => res.send('API Gateway is running'));

// Start the API Gateway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
