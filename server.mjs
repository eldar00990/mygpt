import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = process.env.PORT || 3000;
const root = process.cwd();
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
const guide = `You are EcoPulse Guide, an encouraging, thoughtful climate-action assistant for university students. Answer in the user's language. Help with any climate, sustainability, campus-project, lifestyle, or environmental question. Be honest about uncertainty and do not invent sources or statistics. Give a clear, tailored explanation and end with a short line starting “Next step:” that offers one realistic action. Keep answers under 220 words unless the user asks for detail.`;

async function readBody(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  return JSON.parse(body || "{}");
}

createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url === "/api/chat") {
      if (!process.env.OPENAI_API_KEY) throw new Error("AI connection is not configured. Add OPENAI_API_KEY to your environment, then restart the server.");
      const { messages } = await readBody(request);
      if (!Array.isArray(messages) || !messages.length) throw new Error("Please send a question.");
      const apiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", instructions: guide, input: messages.map(message => ({ role: message.role, content: message.content })), max_output_tokens: 450 })
      });
      const data = await apiResponse.json();
      if (!apiResponse.ok) throw new Error(data.error?.message || "The AI service returned an error.");
      const reply = data.output_text || data.output?.flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text).join("\n");
      response.writeHead(200, { "Content-Type": "application/json" }); response.end(JSON.stringify({ reply })); return;
    }
    const urlPath = request.url === "/" ? "/index.html" : request.url.split("?")[0];
    const file = normalize(join(root, urlPath));
    if (!file.startsWith(root)) throw new Error("Not found");
    const content = await readFile(file);
    response.writeHead(200, { "Content-Type": mime[extname(file)] || "application/octet-stream" }); response.end(content);
  } catch (error) {
    const status = request.url === "/api/chat" ? 500 : 404;
    response.writeHead(status, { "Content-Type": "application/json" }); response.end(JSON.stringify({ error: error.message }));
  }
}).listen(port, () => console.log(`EcoPulse is running at http://localhost:${port}`));
