export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const { message } =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    if (!message) {
      return res.status(400).json({ error: "No message" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
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

    res.status(200).json({
      reply: data?.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
