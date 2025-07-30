const micButton = document.getElementById('mic-button');
const aiCharacter = document.getElementById('ai-character');
const responseBox = document.getElementById('response');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

const synth = window.speechSynthesis;

let userName = localStorage.getItem('userName');

window.onload = () => {
  if (!userName) {
    const name = prompt("Hi, what's your name?");
    if (name) {
      userName = name;
      localStorage.setItem('userName', name);
      speak(`Nice to meet you, ${name}`);
    }
  } else {
    speak(`Welcome back, ${userName}`);
  }
};

micButton.addEventListener('click', () => {
  recognition.start();
  aiCharacter.src = 'jarvis-listening.png';
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  responseBox.innerText = 'Thinking...';
  aiCharacter.src = 'jarvis-thinking.png';

  const reply = await getGeminiResponse(transcript);
  responseBox.innerText = reply;
  speak(reply);
  aiCharacter.src = 'jarvis-talking.png';
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = synth.getVoices().find(v => v.name.includes("Google UK English Male")) || synth.getVoices()[0];
  synth.speak(utterance);
}

// ✅ Gemini API Call using your key
async function getGeminiResponse(query) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyClEK5QUc5-fJpNKPpYWOtssYXoORM0PYE",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: query }],
              role: "user"
            }
          ]
        })
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn’t find an answer.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong while contacting Gemini.";
  }
}
