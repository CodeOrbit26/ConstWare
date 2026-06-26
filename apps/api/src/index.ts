import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";

// Load configuration
dotenv.config({ path: path.join(__dirname, "../.env") });

import apiRoutes from "./routes";

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP headers for API endpoints to prevent issues with CORS fetches from Capacitor / Web app
}));

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

// API Router
app.use("/api", apiRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Bootstrap server
app.listen(PORT, () => {
  console.log(`[ConstWare API] Server running on http://localhost:${PORT}`);
});
