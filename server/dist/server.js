"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/server.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Import auth routes
// Load environment variables
dotenv_1.default.config();
// Connect to database
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json()); // Body parser for JSON data
app.use((0, cors_1.default)()); // Enable CORS for all routes
// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});
// Use authentication routes
app.use('/api/auth', authRoutes_1.default); // All auth routes will be prefixed with /api/auth
// Define port
const PORT = process.env.PORT || 5000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map