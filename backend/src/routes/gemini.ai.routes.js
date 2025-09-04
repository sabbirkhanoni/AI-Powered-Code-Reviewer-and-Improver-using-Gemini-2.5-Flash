import express from "express";
import { getGeminiAIReviewController } from "../controllers/gemini.ai.controller.js";

const router = express.Router();

router.post("/get-review", getGeminiAIReviewController);

export default router;
