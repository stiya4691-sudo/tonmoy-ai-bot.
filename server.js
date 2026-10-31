import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const apiKey = process.env.OPENAI_API_KEY;

app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, apiKeyConfigured: Boolean(apiKey) });
});

app.post("/api/analyze", async (req, res) => {
  try {
    if (!apiKey) return res.status(503).json({ error: "Server এ OPENAI_API_KEY সেট করা নেই। .env ফাইল দেখো।" });
    const rows = req.body?.rows;
    if (!Array.isArray(rows) || rows.length < 5 || rows.length > 500) {
      return res.status(400).json({ error: "৫ থেকে ৫০০টি valid result row পাঠাও।" });
    }
    const clean = rows.map((r) => {
      if (!Array.isArray(r) || r.length !== 2) throw new Error("Invalid row format");
      const period = Number(r[0]), sum = Number(r[1]);
      if (!Number.isFinite(period) || !Number.isInteger(sum) || sum < 3 || sum > 18) throw new Error("Invalid period or sum");
      return [period, sum];
    });

    const counts = {
      big: clean.filter(([,s]) => s >= 11).length,
      small: clean.filter(([,s]) => s <= 10).length,
      even: clean.filter(([,s]) => s % 2 === 0).length,
      odd: clean.filter(([,s]) => s % 2 !== 0).length
    };

    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6.1-terra",
      instructions: `You are a cautious statistical analyst reviewing historical K3 dice-sum outcomes.
Do not claim you can predict random independent outcomes. Do not provide betting instructions, staking advice, guaranteed wins, or fabricated confidence percentages.
Analyze only the supplied data. Sum 3-10 is SMALL, 11-18 is BIG. Even sums are EVEN, odd sums are ODD.
Mention sample size, counts, notable frequency/sequence observations, limitations, and whether apparent patterns could be random noise.
If offering a next-round hypothesis, label it explicitly as a low-confidence experimental guess, explain that it is not a reliable prediction, and do not invent a probability.
Answer in simple Bangla/Banglish, concise and structured.`,
      input: `Analyze these historical records. Each row is [period, sum]. Counts: ${JSON.stringify(counts)}. Records: ${JSON.stringify(clean)}`
    });
    const analysis = (response.output_text || "").trim();
    if (!analysis) return res.status(502).json({ error: "AI থেকে খালি response এসেছে। আবার চেষ্টা করো।" });
    res.json({ analysis, counts, sampleSize: clean.length });
  } catch (error) {
    console.error("Analysis error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Analysis failed" });
  }
});

app.listen(port, "0.0.0.0", () => console.log(`TONMOY AI BOT running at http://localhost:${port}`));
