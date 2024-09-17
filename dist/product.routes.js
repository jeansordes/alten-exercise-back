"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const router = express_1.default.Router();
// Create a new product
router.post('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const { code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating } = req.body;
    const createdAt = Date.now();
    const updatedAt = createdAt;
    db.run(`INSERT INTO products (code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating, createdAt, updatedAt], function (err) {
        if (err) {
            console.error('Error creating product:', err);
            res.status(500).json({ message: 'Error creating product' });
        }
        else {
            res.status(201).json({ id: this.lastID });
        }
    });
}));
// Get all products
router.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    db.all('SELECT * FROM products', (err, rows) => {
        res.json(rows);
    });
}));
router.delete('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    db.exec(`DROP TABLE IF EXISTS products`, function (err) {
        if (err) {
            console.error('Error deleting table:', err);
            res.status(500).json({ message: 'Error deleting table' });
        }
        else {
            (0, database_1.initDb)();
            res.json({ message: '"Products" table deleted, reinitialized' });
        }
    });
}));
// Get a product by ID
router.get('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) {
            console.error('Error fetching product:', err);
            res.status(500).json({ message: 'Error fetching product' });
        }
        else if (rows) {
            res.json(rows);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
}));
// Update a product
router.patch('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const { code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating } = req.body;
    const updatedAt = Date.now();
    const updateFields = Object.keys(req.body).map(key => `${key} = ?`).join(', ');
    const updateValues = Object.values(req.body);
    db.run(`UPDATE products SET ${updateFields}, updatedAt = ? WHERE id = ?`, [...updateValues, updatedAt, req.params.id], function (err) {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ message: 'Error updating product' });
        }
        else if (this.changes > 0) {
            res.json({ message: 'Product updated' });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
}));
// Delete a product
router.delete('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ message: 'Error deleting product' });
        }
        else if (this.changes > 0) {
            res.json({ message: 'Product deleted' });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
}));
exports.default = router;
