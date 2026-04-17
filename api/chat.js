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
          model: "llama3-8b-8192",
          messages: [
            { role: "user", content: body.message }
          ]
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
