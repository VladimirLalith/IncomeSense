"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/transactionRoutes.ts
const express_1 = __importDefault(require("express"));
const transactionControllers_1 = require("../controllers/transactionControllers");
const authMiddleware_1 = require("../middleware/authMiddleware"); // Import the protect middleware
const router = express_1.default.Router();
// Apply the protect middleware to all routes defined below in this router
router.use(authMiddleware_1.protect); // This means all routes below require authentication
router.route('/').get(transactionControllers_1.getTransactions).post(transactionControllers_1.addTransaction);
router.route('/:id').put(transactionControllers_1.updateTransaction).delete(transactionControllers_1.deleteTransaction);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map