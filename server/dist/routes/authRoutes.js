"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const router = express_1.default.Router();
router.post('/register', authControllers_1.registerUser);
router.post('/login', authControllers_1.loginUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map