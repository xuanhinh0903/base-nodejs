// Import required modules using ES6 syntax
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PORT } from './config/env.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import profileRoutes from './routes/profile.route.js';

// Create Express application instance
const app = express();

// Define port for the server to run on
// Use environment variable PORT if available, otherwise default to 3000
const serverPort = PORT;

// Middleware configuration
// Enable CORS for cross-origin requests
app.use(cors());

// Add security headers using helmet
app.use(helmet());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Node.js API!',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
// This catches any errors thrown in the application
app.use((err, req, res, _next) => {
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: ['GET /', 'GET /health'],
  });
});

// Start the server
app.listen(serverPort, () => {
  console.log(`🚀 Server is running on port ${serverPort}`);
});

// async function testDB() {
//   try {
//     const res = await pool.query('SELECT NOW()');
//     console.log('✅ Connected to PostgreSQL at:', res.rows[0].now);
//   } catch (err) {
//     console.error('❌ Connection failed:', err);
//   }
// }

// testDB();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Export app for testing purposes
export default app;
