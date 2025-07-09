const speakBtn = document.getElementById("speakBtn");
const status = document.getElementById("status");
const wordEl = document.getElementById("word");
const phoneticEl = document.getElementById("phonetic");
const definitionEl = document.getElementById("definition");
const exampleEl = document.getElementById("example");
const playBtn = document.getElementById("playAudio");

let audioSrc = "";

speakBtn.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Your browser doesn't support speech recognition.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  status.textContent = "🎤 Listening...";

  recognition.onresult = function (event) {
    const word = event.results[0][0].transcript.trim();
    status.textContent = `🔎 Searching: "${word}"`;
    fetchMeaning(word);
  };

  recognition.onerror = function () {
    status.textContent = "❌ Try again.";
  };
});

function fetchMeaning(word) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => res.json())
    .then((data) => {
      const entry = data[0];
      const meaning = entry.meanings[0].definitions[0];

      wordEl.textContent = entry.word;
      phoneticEl.textContent = entry.phonetics[0]?.text || "";
      definitionEl.textContent = `📘 ${meaning.definition}`;
      exampleEl.textContent = meaning.example ? `💬 "${meaning.example}"` : "";
      audioSrc = entry.phonetics[0]?.audio || "";
      if (audioSrc) {
        playBtn.style.display = "inline-block";
      } else {
        playBtn.style.display = "none";
      }
    })
    .catch(() => {
      wordEl.textContent = "";
      phoneticEl.textContent = "";
      definitionEl.textContent = "❌ No definition found.";
      exampleEl.textContent = "";
      playBtn.style.display = "none";
    });
}

playBtn.addEventListener("click", () => {
  if (audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play();
  }
});
