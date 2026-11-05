import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import dns from "node:dns";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server Started on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
