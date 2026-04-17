async function send() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const text = input.value;
  if (!text) return;

  // USER MESSAGE
  messages.innerHTML += `
    <div class="msg user">${text}</div>
  `;

  input.value = "";

  // loading bubble
  const loading = document.createElement("div");
  loading.className = "msg ai";
  loading.textContent = "Thinking...";
  messages.appendChild(loading);

  messages.scrollTop = messages.scrollHeight;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  loading.textContent = data.reply;
  messages.scrollTop = messages.scrollHeight;
}
