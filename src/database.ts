import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { Product } from './product.model';

let db: sqlite3.Database = new sqlite3.Database('./app.sqlite.db'); // alternative => :memory:

export const initDb = async () => {
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
    const filePath = path.join(__dirname, './../../front/src/assets/products.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const products: Product[] = JSON.parse(jsonData);

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
};

export const getDb = () => db;