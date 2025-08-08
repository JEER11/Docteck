// Puter.js client for GPT-4o and other models
// See: https://developer.puter.com/tutorials/free-unlimited-openai-api/

export async function puterChatCompletion({ messages, model = "gpt-4o" }) {
  const response = await fetch("https://api.puter.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false
    })
  });
  if (!response.ok) throw new Error("Puter API error");
  const data = await response.json();
  return data.choices[0].message.content;
}
