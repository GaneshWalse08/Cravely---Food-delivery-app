import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

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
