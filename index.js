import "dotenv/config"; 
import express from "express";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/index.js";
import cookieParser from 'cookie-parser';
import cors from "cors";

// connectDB()


// const app=express();
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: ["http://localhost:3000","http://localhost:5173","https://www.scanobees.com/"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// const port = process.env.PORT;

// app.get('/', (req, res) => {
//     res.send('Hello asif World!')
//   });
  
//   app.listen(port, () => {
//     console.log(`app listening on port ${port}`)
//     // console.log(process.env.MONGO_URI);
//   });

// app.use('/api',apiRouter)

//   app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' })
// })




connectDB();
const app = express();



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

/* 🔥 HANDLE PREFLIGHT REQUESTS */
app.options("*", cors());

/* ─────────────────────────────
   BODY + COOKIES
───────────────────────────── */

app.use(express.json());
app.use(cookieParser());

/* ─────────────────────────────
   ROUTES
───────────────────────────── */

app.get("/", (req, res) => {
  res.send("Scanobees API running");
});

app.use("/api", apiRouter);

/* ─────────────────────────────
   404 HANDLER
───────────────────────────── */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ─────────────────────────────
   START SERVER
───────────────────────────── */

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
