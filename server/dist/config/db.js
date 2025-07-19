"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/config/db.ts
const mongoose_1 = __importDefault(require("mongoose")); // Use import syntax
const connectDB = async () => {
    try {
        // Ensure process.env.MONGO_URI is treated as a string
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI); // Mongoose v6+ simplified options
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) { // Type 'any' for error caught in catch block
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};
exports.default = connectDB; // Use export default syntax
//# sourceMappingURL=db.js.map