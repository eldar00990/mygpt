const chatForm = document.getElementById("chatForm");
const promptBox = document.getElementById("userPrompt");
const chatLog = document.getElementById("chatLog");
const conversation = [];

function goToChecker() { document.querySelector("#checker").scrollIntoView({ behavior: "smooth", block: "start" }); setTimeout(() => promptBox.focus(), 500); }
function escapeHtml(text) { const div = document.createElement("div"); div.textContent = text; return div.innerHTML; }

function addMessage(kind, content, isThinking = false) {
  const message = document.createElement("div");
  message.className = `message ${kind === "user" ? "user-message" : "assistant-message"}`;
  message.dataset.thinking = isThinking;
  message.innerHTML = `<span class="message-label">${kind === "user" ? "YOU" : "ECOPULSE"}</span><p>${isThinking ? "Thinking through it…" : escapeHtml(content)}</p>`;
  chatLog.appendChild(message); chatLog.scrollTop = chatLog.scrollHeight;
  return message;
}

function saveAction(action) {
  document.getElementById("resultBox").innerHTML = `<div class="result-summary"><div class="score-ring" style="--score:270deg"><div><strong>75</strong><span>READY TO START</span></div></div><div class="summary-copy"><h3>Your action for this week</h3><p>${escapeHtml(action)}. Keep it simple, put it somewhere visible, and check in with yourself after seven days.</p></div></div><div class="result-list"><article class="result-card"><div class="num">01 / YOUR COMMITMENT</div><h3>${escapeHtml(action)}</h3><p>You chose a practical step from your own question — that is a strong place to begin.</p><button class="commit-btn" type="button" onclick="completeAction()">I’ll start this week ✓</button></article><article class="result-card"><div class="num">02 / REFLECT</div><h3>Notice what helps</h3><p>At the end of the week, ask: what made this easier, and what would make the next step more realistic?</p></article></div>`;
  document.getElementById("pledgeStatus").textContent = "Action saved"; document.getElementById("progressFill").style.width = "25%";
}
function completeAction() { document.getElementById("pledgeStatus").textContent = "Week started — great choice"; document.getElementById("progressFill").style.width = "55%"; }
function usePrompt(button) { promptBox.value = button.textContent; promptBox.focus(); }
function clearChat() { conversation.length = 0; chatLog.innerHTML = '<div class="message assistant-message"><span class="message-label">ECOPULSE</span><p>Fresh start. Tell me what you want to understand, change, or build.</p></div>'; promptBox.focus(); }

chatForm.addEventListener("submit", async event => {
  event.preventDefault();
  const question = promptBox.value.trim();
  if (!question) return;
  addMessage("user", question); promptBox.value = ""; conversation.push({ role: "user", content: question });
  const thinking = addMessage("assistant", "", true);
  try {
    const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: conversation.slice(-10) }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The assistant is unavailable right now.");
    thinking.remove(); addMessage("assistant", data.reply);
    conversation.push({ role: "assistant", content: data.reply });
  } catch (error) {
    thinking.querySelector("p").textContent = error.message.includes("configured") ? "The AI connection needs an API key before it can answer. See SETUP.md in the project." : "I couldn’t reach the assistant just now. Please try again in a moment.";
  }
});
