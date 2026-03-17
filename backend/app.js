import authRoutes from "./routes/authRoutes.js";
import developerRoutes from "./routes/developerRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/developers", developerRoutes);
app.use("api/clients", clientRoutes);
export default app;