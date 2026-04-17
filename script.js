async function send() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const text = input.value.trim();
  if (!text) return;

  // USER MESSAGE
  messages.innerHTML += `
    <div class="row user">
      <div class="bubble">${text}</div>
    </div>
  `;

  input.value = "";

  // AI LOADING MESSAGE
  const row = document.createElement("div");
  row.className = "row ai";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = "Thinking...";

  row.appendChild(bubble);
  messages.appendChild(row);

  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    // 🧠 CLEAN BAD OUTPUT
    let clean = data.reply || "No response";

    // Fix empty html code blocks
    clean = clean.replace(/```html\s*```/g, "```html\n<!-- empty -->\n```");

    // Fix missing spacing after code block language
    clean = clean.replace(/```(\w+)([^\n])/g, "```$1\n$2");

    // Render markdown (requires marked.js in HTML)
    bubble.innerHTML = marked.parse(clean);

  } catch (err) {
    bubble.textContent = "Error connecting to AI.";
  }

  messages.scrollTop = messages.scrollHeight;
}
