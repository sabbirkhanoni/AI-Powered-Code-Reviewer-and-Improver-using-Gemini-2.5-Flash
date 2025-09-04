import generateContent from "../services/gemini.ai.services.js";

export async function getGeminiAIReviewController(req, res) {
    const code = req.body.code;

    // Validate code
    if (!code) {
      return res.status(400).send("Code is required");
    }

    const response = await generateContent(code);
    res.status(200).send(response);
}
