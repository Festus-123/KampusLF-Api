import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth/authRoutes.js';
import itemsRoutes from './routes/items/itemsRoutes.js';
import requestRoutes from './routes/request/requestRoutes.js';
import erroHandlerMiddleware from './middlewares/error/errorMiddleware.js';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 40
})

app.use(limiter)
app.use(pinoHttp());

app.get("/health", (req, res) => res.status(200).json({ status: "ok" })); 

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/items", itemsRoutes);
app.use("/api/v1/requests", requestRoutes);

app.use(erroHandlerMiddleware);

export default app;