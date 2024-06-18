// Import necessary modules or dependencies here
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, '../.env'), // Adjust the path if your .env file is located elsewhere
});

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Example route
app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
  res.send('Hello, Levin Backend!');
});

// Define a port for the server to listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
