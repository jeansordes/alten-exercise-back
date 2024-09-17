import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './product.routes';
import { initDb } from './database';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4200'
}));

// Routes
app.use('/api', productRoutes);
app.get("/", (req, res) => res.send(":)"));

// Initialize the database and start the server
initDb().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Failed to initialize the database:', error);
});
