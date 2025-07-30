// script.js
const micButton = document.getElementById("mic-button");
const responseBox = document.getElementById("response");
const animeGirl = document.getElementById("anime-girl");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

const synth = window.speechSynthesis;

micButton.addEventListener("click", () => {
  animeGirl.src = "https://i.ibb.co/7gZygHw/wave.gif"; // speaking animation
  recognition.start();
});

recognition.onresult = async (event) => {
  const userInput = event.results[0][0].transcript;
  responseBox.textContent = "Thinking...";
  const reply = await fetchGeminiResponse(userInput);
  responseBox.textContent = reply;
  speak(reply);
};

recognition.onend = () => {
  animeGirl.src = "https://i.ibb.co/FgZygHw/blink-idle.gif"; // back to idle
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onstart = () => {
    animeGirl.src = "https://i.ibb.co/FgZygHw/talk.gif";
  };
  utterance.onend = () => {
    animeGirl.src = "https://i.ibb.co/FgZygHw/blink-idle.gif";
  };
  synth.speak(utterance);
}

async function fetchGeminiResponse(userInput) {
  const apiKey = "AIzaSyAQ4PgdIioXskS4QPZKiV88ql_2H4JIrdY";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

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
    responseBox.textContent = JSON.stringify(data, null, 2);

    const reply =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join(" ") ||
      "Sorry, I didn’t understand that.";

    return reply;
  } catch (error) {
    return "There was a problem reaching the AI. Please try again.";
  }
}