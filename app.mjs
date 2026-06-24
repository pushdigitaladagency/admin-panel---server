import express from 'express';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

app.get('/', (req, res) => {
    const healthCheck = {
        name: 'API Gateway',
        status: 'UP',
        timestamp: new Date().toISOString(),
        message: 'Health check passed'
    };
    res.json(healthCheck);
});

export default app;