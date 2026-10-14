import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import authRoutes from './routes/auth/authRoutes.js';
import itemsRoutes from './routes/items/itemsRoutes.js';
import erroHandlerMiddleware from './middlewares/error/errorMiddleware.js';
const PORT = 3000;

const app = express();

app.use(helmet());

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/items", itemsRoutes);

app.use(erroHandlerMiddleware);

app.listen(PORT, () => {
    console.log("Server is runing... entry point index.js")
})