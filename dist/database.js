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
exports.getDb = exports.initDb = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let db = new sqlite3_1.default.Database(':memory:');
// alternatives => ':memory:'
// alternatives => './app.sqlite.db'
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    db.exec(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT,
        name TEXT,
        description TEXT,
        image TEXT,
        category TEXT,
        price REAL,
        quantity INTEGER,
        internalReference TEXT,
        shellId INTEGER,
        inventoryStatus TEXT,
        rating REAL,
        createdAt INTEGER,
        updatedAt INTEGER
    )`);
    // Insert products into the database
    const filePath = path_1.default.join(__dirname, './../../front/src/assets/products.json');
    const jsonData = fs_1.default.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(jsonData);
    const insertStmt = `INSERT INTO products (id, code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    for (const product of products) {
        db.run(insertStmt, [
            product.id,
            product.code,
            product.name,
            product.description,
            product.image,
            product.category,
            product.price,
            product.quantity,
            product.internalReference,
            product.shellId,
            product.inventoryStatus,
            product.rating,
            product.createdAt,
            product.updatedAt
        ]);
    }
    return db;
});
exports.initDb = initDb;
const getDb = () => db;
exports.getDb = getDb;
