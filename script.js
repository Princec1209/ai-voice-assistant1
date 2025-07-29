
const micButton = document.getElementById('mic-button');
const aiCharacter = document.getElementById('ai-character');
const responseBox = document.getElementById('response');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

const synth = window.speechSynthesis;
let speaking = false;
    aiCharacter.classList.remove("speaking");
    aiCharacter.classList.add("idle");

micButton.addEventListener('click', () => {
  if (!speaking) {
    recognition.start();
  }
});

recognition.onresult = async (event) => {
  const text = event.results[0][0].transcript.toLowerCase();
  responseBox.textContent = "You said: " + text;

  if (text.includes("hello")) {
    speak("Hi there!");
  } else if (text.includes("how are you")) {
    speak("I'm doing great! Thank you!");
  } else if (text.includes("what's your name") || text.includes("your name")) {
    speak("I'm your anime voice assistant!");
  } else if (text.includes("joke")) {
    speak("Why don't robots ever get tired? Because they recharge!");
  } else {
    const reply = await fetchGeminiResponse(text);
    speak(reply);
  }
};

function speak(message) {
  const utterance = new SpeechSynthesisUtterance(message);
  speaking = true;
  utterance.onend = () => {
    speaking = false;
    aiCharacter.classList.remove("speaking");
    aiCharacter.classList.add("idle");
  };
  aiCharacter.classList.remove("idle"); aiCharacter.classList.add("speaking");
  synth.speak(utterance);
  responseBox.textContent = "Assistant: " + message;
}

async function fetchGeminiResponse(prompt) {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAQ4PgdIioXskS4QPZKiV88ql_2H4JIrdY", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  try {
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    return "Sorry, I couldn't understand that.";
  }
}
