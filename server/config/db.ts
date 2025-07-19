// server/config/db.ts
import mongoose from 'mongoose'; // Use import syntax

const connectDB = async () => {
    try {
        // Ensure process.env.MONGO_URI is treated as a string
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI); // Mongoose v6+ simplified options

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) { // Type 'any' for error caught in catch block
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB; // Use export default syntax