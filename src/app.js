import { errorHandler, notFoundHandler } from './middlewares/error.js';

import express from 'express';
import helmet from 'helmet';
import router from './routes/index.js';

// Initialize the application
const app = express();

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});

// API routes
app.use('/api/docs', router);

// Handle non-existent routes
app.use(notFoundHandler);

// Global error handling
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;