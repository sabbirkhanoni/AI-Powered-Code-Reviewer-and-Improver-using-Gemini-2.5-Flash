import express from "express";
import geminiAiRoutes from "./routes/gemini.ai.routes.js";
import cors from "cors";

//when you call express, it creates an express server for application but does not start a server
//express();

const app = express();
app.use(cors());

app.use(express.json());

// Gemini AI routes
app.use("/ai", geminiAiRoutes);

export default app;
