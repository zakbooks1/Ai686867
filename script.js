async function send() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const userText = input.value;
  messages.innerHTML += `<div><b>You:</b> ${userText}</div>`;

  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: userText })
  });

  const data = await res.json();

  messages.innerHTML += `<div><b>AI:</b> ${data.reply}</div>`;
  messages.scrollTop = messages.scrollHeight;
}