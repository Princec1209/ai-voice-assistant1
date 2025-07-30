const micButton = document.getElementById("mic-button");
const aiCharacter = document.getElementById("ai-character");
const responseBox = document.getElementById("response");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
  voices = synth.getVoices();
}
loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}

const GEMINI_API_KEY = "AIzaSyClEK5QUc5-fJpNKPpYWOtssYXoORM0PYE";

micButton.addEventListener("click", () => {
  responseBox.textContent = "Listening...";
  aiCharacter.classList.add("listening");
  recognition.start();
});

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  responseBox.textContent = `You said: ${transcript}`;
  aiCharacter.classList.remove("listening");
  aiCharacter.classList.add("thinking");

  getGeminiResponse(transcript).then((responseText) => {
    responseBox.textContent = responseText;
    aiCharacter.classList.remove("thinking");
    aiCharacter.classList.add("speaking");
    speak(responseText);
  });
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices.find(v => v.name.includes("Google UK English Male")) || voices[0];
  synth.speak(utterance);
  utterance.onend = () => {
    aiCharacter.classList.remove("speaking");
  };
}

async function getGeminiResponse(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (
      data &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "Sorry, I couldn't understand that.";
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, something went wrong while connecting to Gemini.";
  }
}
