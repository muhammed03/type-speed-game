const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endgameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const resultsBtn = document.getElementById("results-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");
const easyColumn = document.getElementById("easy");
const hardColumn = document.getElementById("hard");
const mediumColumn = document.getElementById("medium");
const closeBtn = document.getElementById("close-btn");

let words = [];

text.focus();
let scoreResults =
  localStorage.getItem("scoreResults") !== null
    ? JSON.parse(localStorage.getItem("scoreResults"))
    : [];

let index =
  localStorage.getItem("index") !== null ? localStorage.getItem("index") : 0;

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

  // Add current result to the array
  function addScoreToResultsData() {
    const scoreData = {
      id: index,
      scoreMode: difficulty,
      result: score,
    };
    scoreResults.push(scoreData);
    index++;
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
        <button onclick="updateRound()">Reload</button>
      `;
    endgameEl.style.display = "flex";
    scoreEl.innerHTML = 0;
    timeEl.innerHTML = 10 + "s";
    addScoreToResultsData();
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

function updateRound() {
  endgameEl.style.display = "none";
  text.value = "";
  gameRound();
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("scoreResults", JSON.stringify(scoreResults));
  localStorage.setItem("index", index);
}

// Add results to container
function addResults() {
  scoreResults
    .filter(function (item) {
      return item.scoreMode === "hard";
    })
    .sort(function (a, b) {
      return b.result - a.result;
    })
    .map(function (e) {
      let hardItem = document.createElement("div");
      hardItem.innerText = e.result;

      if (e.result > 0) {
        hardColumn.appendChild(hardItem);
      }
    });

  scoreResults
    .filter(function (item) {
      return item.scoreMode === "easy";
    })
    .sort(function (a, b) {
      return b.result - a.result;
    })
    .map(function (e) {
      let easyItem = document.createElement("div");
      easyItem.innerText = e.result;
      if (e.result > 0) {
        easyColumn.appendChild(easyItem);
      }
    });

  scoreResults
    .filter(function (item) {
      return item.scoreMode === "medium";
    })
    .sort(function (a, b) {
      return b.result - a.result;
    })
    .map(function (e) {
      let item = document.createElement("div");
      item.innerText = e.result;
      if (e.result > 0) {
        mediumColumn.appendChild(item);
      }
    });
}

function showResults() {
  document.querySelector(".popup-container").style.display = "flex";
  addResults();
}

function closeResults() {
  document.querySelector(".popup-container").style.display = "none";
}

// Show results
resultsBtn.addEventListener("click", showResults);

// Clsoe results
closeBtn.addEventListener("click", closeResults);
