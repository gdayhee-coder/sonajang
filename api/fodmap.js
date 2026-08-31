const https = require("https");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: "query required" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "No API key" });

  const body = JSON.stringify({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 150,
    messages: [{
      role: "user",
      content: `음식 FODMAP 수준을 JSON으로만 답하세요. 음식: ${query}. 형식: {"lv":"low","reason":"한줄이유"} lv는 low/mid/high 중 하나.`
    }]
  });

  return new Promise((resolve) => {
    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req2 = https.request(options, (r) => {
      let data = "";
      r.on("data", chunk => data += chunk);
      r.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const txt = (parsed.content || []).map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
          const result = JSON.parse(txt);
          res.status(200).json(result);
        } catch (e) {
          res.status(500).json({ error: "Parse error: " + data.slice(0, 200) });
        }
        resolve();
      });
    });

    req2.on("error", (e) => {
      res.status(500).json({ error: "Request error: " + e.message });
      resolve();
    });

    req2.write(body);
    req2.end();
  });
};
