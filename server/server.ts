// server/server.ts
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes'; // Import transaction routes


// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app: Application = express();


// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors({
    origin: ['https://income-sense-87mlp4wbc-lalith-varmas-projects.vercel.app'], // ✅ your Vercel frontend domain
    credentials: true // optional: if you're using cookies/auth headers
  }));
  

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use transaction routes
app.use('/api/transactions', transactionRoutes); // All transaction routes will be prefixed with /api/transactions

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});