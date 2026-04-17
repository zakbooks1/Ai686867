async function send() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const text = input.value.trim();
  if (!text) return;

  messages.innerHTML += `<div>You: ${text}</div>`;
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  messages.innerHTML += `<div>AI: ${data.reply}</div>`;
}
