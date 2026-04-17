export default async function handler(req, res) {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    // Parse request
    const { message } =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Call Groq API
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
              content: `
You are a coding assistant.

Rules:
- Always format code using markdown blocks
- Always include language (html, css, javascript)
- Never output random letters like "l" or "s"
- Always give clean, working examples
- Separate sections clearly
              `
            },
            {
              role: "user",
              content: message
            }
          ],

          temperature: 0.7,
          max_tokens: 800
        })
      }
    );

    const data = await response.json();

    // Safe response
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "No response";

    res.status(200).json({ reply });

  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}
