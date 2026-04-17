async function send() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const text = input.value.trim();
  if (!text) return;

  // user message
  messages.innerHTML += `
    <div class="row user">
      <div class="bubble">${text}</div>
    </div>
  `;

  input.value = "";

  // AI placeholder
  const aiRow = document.createElement("div");
  aiRow.className = "row ai";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = "Thinking...";

  aiRow.appendChild(bubble);
  messages.appendChild(aiRow);

  messages.scrollTop = messages.scrollHeight;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  bubble.textContent = data.reply;
  messages.scrollTop = messages.scrollHeight;
}
