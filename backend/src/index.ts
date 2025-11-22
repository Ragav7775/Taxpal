import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from "http";
import mongoose from 'mongoose';
import "dotenv/config";
import "./mongodb/DBConnection"
import UserRoutes from "./routes/UserRoutes"
import TransactionRoutes from "./routes/TransactionRoutes"
import BudgetRoutes from "./routes/BudgetRoutes"
import DashboardRoutes from "./routes/DashboardRoutes"
import TaxEstimationRoutes from "./routes/TaxEstimationRoutes"
import SettingsRoutes from "./routes/SettingsRoutes"
import ReportRoutes from "./routes/ReportRoutes"

import { v2 as cloudinary } from 'cloudinary';


mongoose.connect(process.env.MONGODB_TAXPAL_STRING as string);

http.globalAgent.maxSockets = Infinity;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));


app.use("/api/user/v1", UserRoutes);
app.use("/api/user/v1/transactions", TransactionRoutes);
app.use("/api/user/v1/budget", BudgetRoutes);
app.use("/api/user/v1/dashboard", DashboardRoutes);
app.use("/api/user/v1/tax-estimation", TaxEstimationRoutes);
app.use("/api/user/v1/settings", SettingsRoutes);
app.use("/api/user/v1/report", ReportRoutes);



app.use("/status", (req, res) => {
    res.status(200).json({ message: "Server is Running in port 8080" });
});

const PORT = parseInt(process.env.PORT || '8080', 10);


app.listen(PORT, () => {
    console.log("Server is Running in Port: ", PORT);
});