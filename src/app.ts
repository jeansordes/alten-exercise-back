import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/product.routes';
import { initDb } from './database';

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', productRoutes);

// Initialize the database and start the server
initDb().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Failed to initialize the database:', error);
});
