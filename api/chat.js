export default async function handler(req, res) {
  try {
    console.log("Incoming request");

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    console.log("Body:", body);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: "You are a helpful AI assistant."
    },
    {
      role: "user",
      content: message
    }
  ],
  temperature: 0.8,
  max_tokens: 500
})
      }
    );

    const data = await response.json();

    console.log("Groq response:", data);

    return res.status(200).json({
      reply: data?.choices?.[0]?.message?.content || JSON.stringify(data)
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
