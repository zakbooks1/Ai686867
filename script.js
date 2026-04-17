function addMessage(role, text) {
  const messages = document.getElementById("messages");

  const row = document.createElement("div");
  row.className = "row " + role;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (role === "ai") {
    // Clean bad AI output
    let clean = text;

    clean = clean.replace(/\n[l|s]\n/g, "\n");
    clean = clean.replace(/```(\w+)([^\n])/g, "```$1\n$2");

    bubble.innerHTML = marked.parse(clean);

    setTimeout(() => {
      document.querySelectorAll("pre code").forEach(block => {
        hljs.highlightElement(block);
      });
    }, 0);

  } else {
    bubble.textContent = text;
  }

  row.appendChild(bubble);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;

  return bubble;
}

async function send() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  const bubble = addMessage("ai", "Thinking...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    bubble.innerHTML = marked.parse(data.reply);

    document.querySelectorAll("pre code").forEach(block => {
      hljs.highlightElement(block);
    });

  } catch {
    bubble.textContent = "Error connecting to AI.";
  }
}

function newChat() {
  document.getElementById("messages").innerHTML = "";
}
