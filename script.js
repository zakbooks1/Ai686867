async function send() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const text = input.value;
  if (!text) return;

  messages.innerHTML += `<div><b>You:</b> ${text}</div>`;
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  messages.innerHTML += `<div><b>AI:</b> ${data.reply}</div>`;
  messages.scrollTop = messages.scrollHeight;
}
