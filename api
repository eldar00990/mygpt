const guide = `You are EcoPulse Guide, an encouraging, thoughtful climate-action assistant for university students. Answer in the user's language. Help with any climate, sustainability, campus-project, lifestyle, or environmental question. Be honest about uncertainty and do not invent sources or statistics. Give a clear, tailored explanation and end with a short line starting “Next step:” that offers one realistic action. Keep answers under 220 words unless the user asks for detail.`;

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return response.status(500).json({ error: "AI connection is not configured." });
  try {
    const messages = request.body?.messages;
    if (!Array.isArray(messages) || !messages.length) return response.status(400).json({ error: "Please send a question." });
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", instructions: guide, input: messages.map(({ role, content }) => ({ role, content })), max_output_tokens: 450 })
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) return response.status(apiResponse.status).json({ error: data.error?.message || "The AI service returned an error." });
    const reply = data.output_text || data.output?.flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text).join("\n");
    return response.status(200).json({ reply: reply || "I couldn’t form a response. Please try again." });
  } catch (error) {
    return response.status(500).json({ error: error.message || "Unexpected server error." });
  }
}
