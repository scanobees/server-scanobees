import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/index.js";

connectDB();

const app = express();

/* ✅ CORS (NO wildcard route) */
app.use(
  cors({
    origin: [
      "https://www.scanobees.com",
      "https://scanobees.com",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
// for geoip-lite
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.send("Scanobees API running");
});

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});
