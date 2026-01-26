import express from "express";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/index.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
connectDB()
dotenv.config();

const app=express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  
  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    // console.log(process.env.MONGO_URI);
  });

app.use('/api',apiRouter)

  app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})
