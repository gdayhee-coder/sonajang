export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "query required" });
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 100,
        messages: [{
          role: "user",
          content: `음식 FODMAP 수준을 JSON으로만 답하세요. 음식: ${query}. 형식: {"lv":"low","reason":"한줄이유"} low/mid/high 중 하나.`
        }]
      }),
    });
    const data = await r.json();
    const txt = (data.content || []).map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(txt);
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: "분석 실패" });
  }
}
