export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const message = body.message;

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
          // ✅ FIXED MODEL (your old one is dead)
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content: `content: `
You are a coding assistant.

STRICT RULES:
- Always format code using markdown code blocks
- Always include the language (html, css, javascript)
- Never output random letters like "l" or "s"
- Never write code outside of code blocks
- Separate sections clearly

Example:

## HTML
\`\`\`html
<!DOCTYPE html>
<html></html>
\`\`\`

## CSS
\`\`\`css
body { }
\`\`\`
``
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

    // 🔥 SAFE RESPONSE PARSING
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "No response";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
