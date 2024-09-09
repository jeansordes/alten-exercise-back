import express from 'express';
import { getDb, initDb } from '../database';

const router = express.Router();

// Create a new product
router.post('/products', async (req, res) => {
    const db = getDb();
    const { code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating } = req.body;

    const createdAt = Date.now();
    const updatedAt = createdAt;

    db.run(
        `INSERT INTO products (code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating, createdAt, updatedAt]
        , function (err: Error | null) {
            console.log(this, err);
            if (err) {
                console.error('Error creating product:', err);
                res.status(500).json({ message: 'Error creating product' });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        }
    );
});

// Get all products
router.get('/products', async (req, res) => {
    const db = getDb();
    db.all('SELECT * FROM products', (err: Error | null, rows: []) => {
        res.json(rows);
    });
});

router.delete('/products', async (req, res) => {
    const db = getDb();
    db.exec(`DROP TABLE IF EXISTS products`, function (err) {
        if (err) {
            console.error('Error deleting table:', err);
            res.status(500).json({ message: 'Error deleting table' });
        } else {
            initDb();
            res.json({ message: '"Products" table deleted, reinitialized' });
        }
    });
});

// Get a product by ID
router.get('/products/:id', async (req, res) => {
    const db = getDb();
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) {
            console.error('Error fetching product:', err);
            res.status(500).json({ message: 'Error fetching product' });
        } else if (rows) {
            res.json(rows);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
});

// Update a product
router.patch('/products/:id', async (req, res) => {
    const db = getDb();
    const { code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating } = req.body;
    const updatedAt = Date.now();

    db.run(
        `UPDATE products SET code = ?, name = ?, description = ?, image = ?, category = ?, price = ?, quantity = ?, internalReference = ?, shellId = ?, inventoryStatus = ?, rating = ?, updatedAt = ? WHERE id = ?`,
        [code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating, updatedAt, req.params.id], function (err: Error | null) {
            if (err) {
                console.error('Error updating product:', err);
                res.status(500).json({ message: 'Error updating product' });
            } else if (this.changes > 0) {
                res.json({ message: 'Product updated' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        });

});

// Delete a product
router.delete('/products/:id', async (req, res) => {
    const db = getDb();
    db.run('DELETE FROM products WHERE id = ?', [req.params.id]
        , function (err: Error | null) {
            if (err) {
                console.error('Error deleting product:', err);
                res.status(500).json({ message: 'Error deleting product' });
            } else if (this.changes > 0) {
                res.json({ message: 'Product deleted' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        });
});

export default router;
