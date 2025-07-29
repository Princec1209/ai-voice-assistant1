
async function 
fetchGeminiResponse(userInput) {
  const apiKey = 
"AIzaSyAQ4PgdIioXskS4QPZKiV88ql_2H4JIrdY";
  const url = 
`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [{ text: userInput }]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("Gemini API response:",
                data); // 🔍 Debug

    const reply =
      data?.candidates?.
[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t understand that.";

    return reply;
  } catch (error) {
    console.error("Gemini API error:", 
error); // ⚠️ Log fetch error
    return "There was a problem reaching the AI. Please try again.";
  }
}
