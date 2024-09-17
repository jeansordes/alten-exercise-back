"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const product_routes_1 = __importDefault(require("./product.routes"));
const database_1 = require("./database");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200'
}));
// Routes
app.use('/api', product_routes_1.default);
app.get("/", (req, res) => res.send(":)"));
// Initialize the database and start the server
(0, database_1.initDb)().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Failed to initialize the database:', error);
});
