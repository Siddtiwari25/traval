import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());

  // Initialize Gemini AI SDK
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // AI Itinerary Endpoint
  app.post("/api/generate-itinerary", async (req, res) => {
    try {
      const { destination, days, travelStyle, companion } = req.body;
      if (!destination) {
        return res.status(400).json({ error: "Destination is required." });
      }

      const prompt = `Create a detailed day-by-day travel itinerary for "${destination}" for a duration of ${days || 3} days.
The traveler prefers a "${travelStyle || "balanced"}" style of travel accompanied by "${companion || "solo"}". 

Return the response strictly inside a JSON object matching this TypeScript format (do NOT wrap it in markdown block tags like \`\`\`json, just return raw JSON text):
{
  "destination": "Name of the destination",
  "tagline": "A catchy, short description/tagline",
  "summary": "Brief summary of what makes this trip special",
  "estimatedBudget": "E.g. $1,200 - $1,500 total",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "itinerary": [
    {
      "day": 1,
      "theme": "Exploration or Main focus of Day 1",
      "activities": [
        {
          "time": "Morning",
          "title": "Activity name",
          "description": "Short explanation of the activity",
          "cost": "Free or amount",
          "tip": "Practical travel tip"
        },
        {
          "time": "Afternoon",
          "title": "Activity name",
          "description": "Short explanation",
          "cost": "Amount",
          "tip": "Tip"
        },
        {
          "time": "Evening",
          "title": "Activity name",
          "description": "Short explanation",
          "cost": "Amount",
          "tip": "Tip"
        }
      ]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      
      try {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch (e) {
        return res.json({ rawText: text });
      }

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({ error: error.message || "An error occurred with Gemini." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
