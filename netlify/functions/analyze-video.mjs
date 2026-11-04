// Secure server-side Gemini video-frame analysis. The API key must remain in Netlify env vars.
export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return Response.json({ error: "GEMINI_API_KEY is not configured." }, { status: 503 });
    const { frames = [], category = "Sports", prompt = "", filename = "uploaded clip" } = await req.json();
    if (!Array.isArray(frames) || frames.length < 1 || frames.length > 8) {
      return Response.json({ error: "Provide between 1 and 8 sampled frames." }, { status: 400 });
    }
    const rubric = `You are a cautious performance coach assistant reviewing selected frames from a user's ${category} video named "${filename}".
Return ONLY valid JSON with keys: label, score, summary, strengths (array of 2-4 strings), improvements (array of 2-4 strings), drills (array of 2-4 strings), confidence.
score must be null unless the visible evidence supports a defensible 0-100 rubric score. Do not infer identity, age, health, or sensitive traits. Do not claim a professional selection verdict. State when a video frame is insufficient to judge timing or movement. Make the feedback actionable and kind. User request: ${prompt}`;
    const parts = [{ text: rubric }, ...frames.map((data) => ({ inline_data: { mime_type: "image/jpeg", data } }))];
    const apiResp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: 0.35, responseMimeType: "application/json" } })
    });
    const payload = await apiResp.json();
    if (!apiResp.ok) return Response.json({ error: payload?.error?.message || "AI provider error" }, { status: 502 });
    const raw = payload?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("");
    if (!raw) return Response.json({ error: "AI provider returned no analysis." }, { status: 502 });
    const analysis = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
    return Response.json({ analysis });
  } catch (error) {
    return Response.json({ error: error?.message || "Unable to analyze video frames." }, { status: 500 });
  }
};
