export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const { query } = await req.json();
    if (!query) return new Response(JSON.stringify({ error: "query required" }), { status: 400 });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 100,
        messages: [{
          role: "user",
          content: "음식 FODMAP 수준을 JSON으로만 답하세요. 음식: " + query + ". 형식: {\"lv\":\"low\",\"reason\":\"한줄이유\"} lv는 low/mid/high 중 하나."
        }]
      }),
    });

    const data = await r.json();
    const txt = (data.content || []).map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(txt);
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
