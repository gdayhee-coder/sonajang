export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: "query required" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        messages: [{
          role: "user",
          content: "음식 FODMAP 수준을 JSON으로만 답하세요. 음식: " + query + ". 형식: {\"lv\":\"low\",\"reason\":\"한줄이유\"} lv는 low/mid/high 중 하나."
        }]
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(500).json({ error: "Anthropic error: " + errText });
    }

    const data = await r.json();
    const txt = (data.content || []).map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(txt);
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
