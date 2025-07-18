import { GoogleGenAI } from "@google/genai";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const model = "gemini-2.5-flash";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.listen(port, () => {
  console.log(`Gemini API server is running at http://localhost:${port}`);
});

app.post("/api/chat", async (req, res) => {
  const { message: userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message is required" });
  }

  try {
    const result = await genAI.models.generateContent({
      model,
      contents: userMessage,
    });

    res.json({ output: result.text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});
