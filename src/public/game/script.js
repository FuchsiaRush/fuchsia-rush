import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const socket = io("http://localhost:3000");

window.socket = socket;

const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");
const isHost = urlParams.get("host") === "true";

window.history.replaceState({}, document.title, "/game");

if (!gameId) {
  window.location.href = "/";
}

if (isHost) {
  socket.emit("join-room", { gameId, displayName: "HOST" });
} else {
  const nameInput = document.getElementById("name-input");
  const joinButton = document.getElementById("join-button");

  joinButton.onclick = () => {
    const displayName = nameInput.value.trim();
    if (displayName.length > 0) {
      socket.emit("join-room", { gameId, displayName });
    }
  };
  selectScreen("choose-name");
}

socket.on("lobby-state", (players) => {
  console.log("Lobby State:", players);
  document.getElementById("lobby-players");
  players.forEach((player) => {
    const playerDiv = document.createElement("div");
    playerDiv.textContent = player.displayName;
    document.getElementById("lobby-players").appendChild(playerDiv);
  });
  if (isHost) {
    const gameIdH1 = document.getElementById("game-id");
    gameIdH1.style.display = "block";
    gameIdH1.textContent = `Game ID: ${gameId}`;

    const startButton = document.getElementById("start-button");
    startButton.onclick = () => {
      socket.emit("start-game", { gameId });
    };
    startButton.style.display = "block";
    startButton.classList.add("glass");
  }
  selectScreen("lobby");
});

socket.on("new-player", (player) => {
  const lobbyPlayers = document.getElementById("lobby-players");
  const playerDiv = document.createElement("div");
  playerDiv.textContent = player.displayName;
  lobbyPlayers.appendChild(playerDiv);
});

socket.on("question", (question) => {
  console.log("New Question:", question);
  document.getElementById("question-text").textContent = question.text;
  const answersDiv = document.getElementById("answers-container");
  answersDiv.innerHTML = "";
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.value;
    button.disabled = isHost;
    button.onclick = () => {
      socket.emit("submit-answer", {
        gameId,
        questionId: question.id,
        answerIds: [answer.id],
      });
      answersDiv.innerHTML = "";
    };
    answersDiv.appendChild(button);
  });
  const startTime = Date.now();
  setInterval(() => {
    const timeLeft = question.timeToAnswer - (Date.now() - startTime);
    document.getElementById("time-left").textContent = `Time left: ${Math.max(
      0,
      Math.floor(timeLeft / 1000)
    )}s`;
  }, 500);
  selectScreen("question");
});

socket.on("game-finished", (results) => {
  console.log("Game Finished:", results);
  const resultsDiv = document.getElementById("results-container");
  resultsDiv.innerHTML = "";
  results.sort((a, b) => b.score - a.score).forEach((player, i) => {
    const playerDiv = document.createElement("div");
    playerDiv.textContent = `${i+1}. ${player.displayName}: ${player.score} Points`;
    resultsDiv.appendChild(playerDiv);
  });
  selectScreen("results");
});

function selectScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add("active");
  }
}

const gameIdH1 = document.getElementById("game-id");

gameIdH1.onclick = () => {
  let gameIdString = gameIdH1.innerText;
  let gameIdArray = gameIdString.split(" ")
  copyToClipboard(gameIdArray[2])
}

function copyToClipboard(input){
  navigator.clipboard.writeText(input);
}