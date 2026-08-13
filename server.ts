import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy init Gemini AI
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Route: AI Voice-to-Text / Description Polisher
app.post('/api/ai/describe-item', async (req, res) => {
  try {
    const { rawNotes, title, category } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        description: rawNotes || 'Authentic West African marketplace item in great condition.'
      });
    }

    const prompt = `You are an AI assistant for vendors at Accra Central Market in Ghana.
Polish the following vendor notes into a compelling, professional, authentic 2-3 sentence product description. Include details on origin, texture, and care if applicable. Keep tone warm, natural, and trustworthy.

Item Title: ${title || 'Crafted Item'}
Category: ${category || 'General'}
Vendor Notes: "${rawNotes}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const text = response.text || rawNotes;
    res.json({ description: text.trim() });
  } catch (err: any) {
    console.error('Gemini error:', err);
    res.json({ description: req.body.rawNotes || 'Hand-crafted quality item from Accra Central Market.' });
  }
});

// API Route: AI Counter-Offer Suggestion
app.post('/api/ai/suggest-counter', async (req, res) => {
  try {
    const { originalPrice, currentOffer, buyerHistory } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      const defaultCounter = Math.round(originalPrice - (originalPrice - currentOffer) * 0.5);
      return res.json({ suggestedCounter: defaultCounter, reasoning: 'Split the difference evenly.' });
    }

    const prompt = `As a market haggle strategist for Accra Central Market, recommend a realistic counter-offer price for a vendor.
Original Asking Price: GHS/USD ${originalPrice}
Buyer Current Offer: GHS/USD ${currentOffer}
Buyer Notes: ${buyerHistory || 'Standard market buyer'}

Provide JSON response with:
{"suggestedCounter": number, "reasoning": "brief 1 sentence explanation"}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    try {
      const cleaned = response.text?.replace(/```json|```/g, '').trim() || '';
      const parsed = JSON.parse(cleaned);
      res.json(parsed);
    } catch {
      const calcCounter = Math.round(originalPrice - (originalPrice - currentOffer) * 0.4);
      res.json({ suggestedCounter: calcCounter, reasoning: 'Optimal counter-offer based on typical market margin.' });
    }
  } catch (err) {
    res.json({ suggestedCounter: Math.round(req.body.originalPrice * 0.85), reasoning: 'Suggested 15% discount counter.' });
  }
});

// Vite Middleware for Dev vs Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Accra Central Market Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
