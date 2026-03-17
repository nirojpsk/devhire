import authRoutes from "./routes/authRoutes.js";
import developerRoutes from "./routes/developerRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/developers", developerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/admin", adminRoutes);

export default app;