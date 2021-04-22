const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endgameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

getWords();

let words = [];

// Focus on input
text.focus();
// async function to fetch random words
async function getWords() {
  const res = await fetch(
    "https://random-word-api.herokuapp.com/word?number=100"
  );
  const data = await res.json();

  words = [...data];
  return words;
}

getWords().then(() => {
  gameRound();
});

function gameRound() {
  let randomWord;

  let score = 0;

  let time = 10;

  let difficulty =
    localStorage.getItem("difficulty") !== null
      ? localStorage.getItem("difficulty")
      : "medium";

  // Set difficluty select value
  difficultySelect.value =
    localStorage.getItem("difficulty") !== null
      ? localStorage.getItem("difficulty")
      : "medium";

  // Start counting down
  const timeInterval = setInterval(updateTime, 1000);

  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  function addWordToDom() {
    randomWord = getRandomWord();
    word.innerHTML = randomWord;
  }

  // Update score
  updateScore = () => {
    score++;
    scoreEl.innerHTML = score;
  };

  // Update time
  function updateTime() {
    time--;
    timeEl.innerHTML = time + "s";

    if (time == 0) {
      clearInterval(timeInterval);
      // end game
      gameOver();
    }
  }

  // Game over, show end screen
  function gameOver() {
    endgameEl.innerHTML = `
        <h1>Time ran out</h1>
        <p>Your final score is ${score}</p>
        <button onclick="location.reload()">Reload</button>
      `;
    endgameEl.style.display = "flex";
  }

  addWordToDom();

  // Event listneres
  text.addEventListener("input", (e) => {
    const insertedText = e.target.value;
    if (insertedText === randomWord) {
      addWordToDom();
      updateScore();

      // Clear
      e.target.value = "";

      if (difficulty === "hard") {
        time += 2;
      } else if (difficulty === "medium") {
        time += 3;
      } else {
        time += 5;
      }

      updateTime();
    }
  });

  // Settings btn click
  settingsBtn.addEventListener("click", () =>
    settings.classList.toggle("hide")
  );

  // Settings select
  settingsForm.addEventListener("change", (e) => {
    difficulty = e.target.value;
    localStorage.setItem("difficulty", difficulty);
  });
}
