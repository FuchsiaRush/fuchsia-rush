import { randomUUID } from "crypto";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

let game_template = {
  id: "adslfkjaldfsjlfkj",
  owner: "",
  questions: [
    {
      id: "123124",
      text: "Frage",
      answers: [
        {
          id: "1212",
          value: "Yes",
        },
        {
          id: "11",
          value: "No",
        },
        {
          id: "2",
          value: "Noooo",
        },
      ],
      correctAnswerIds: ["11"],
      timeToAnswer: 1000,
      scoreMultiplier: 1,
    },
    {
      id: "123125",
      text: "Frage2",
      answers: [
        {
          id: "1212",
          value: "Yes",
        },
        {
          id: "11",
          value: "No",
        },
        {
          id: "2",
          value: "Noooo",
        },
      ],
      correctAnswerIds: ["11"],
      timeToAnswer: 1000,
      scoreMultiplier: 1,
    },
  ],
};

let GAMES = [
  {
    gameId: "320905",
    owner: {
      id: "123",
      socket: null,
    },
    template: game_template,
    players: [],
    currentQuestionIndex: 0,
    currentQuestionPhase: "SHOW_QUESTION",
    phase: "LOBBY",
  },
];

function nextQuestion(game) {
  game.currentQuestionPhase = "SHOW_QUESTION";
  const question = game.template.questions[game.currentQuestionIndex];
  io.to(game.gameId).emit("question", {
    id: question.id,
    text: question.text,
    answers: question.answers,
    scoreMultiplier: question.scoreMultiplier,
    timeToAnswer: question.timeToAnswer,
  });
}

function evaluateQuestion(game) {
  game.currentQuestionPhase = "EVALUATE";

  for (let player of game.players) {
    for (
      let i = 0;
      i <
      game.template.questions[game.currentQuestionIndex].correctAnswerIds
        .length;
      i++
    ) {
      if (
        player.answers[i].indexOf(
          game.template.questions[game.currentQuestionIndex].correctAnswerIds[i]
        ) < 0
      ) {
        break;
      }

      if (i == player.answers.length - 1) {
        player.score++;
      }
    }

    player.answers = null;
  }
}

app.use("/", express.static("src/public"));

io.on("connection", (socket) => {
  console.log("New connection!");

  socket.on("join-room", (data) => {
    const { gameId, displayName } = data;
    if (!gameId || !displayName) return;
    const game = GAMES.find((g) => g.gameId == gameId && g.phase == "LOBBY");
    if (!game) return;

    socket.join(gameId);

    if (!game.owner.socket) {
      game.owner.socket = socket;
      game.owner.id = randomUUID();
    } else {
      const player = {
        id: randomUUID(),
        displayName,
        score: 0,
        answers: null,
      };

      player.socket = socket;
      game.players.push(player);
    }

    console.log("New Player:", game);
  });

  socket.on("start-game", (data) => {
    const { gameId } = data;
    if (!gameId) return;
    const game = GAMES.find((g) => g.gameId == gameId && g.phase == "LOBBY");
    if (!game) return;
    if (game.owner.socket.id !== socket.id) return;
    game.phase = "IN_GAME";
    nextQuestion(game);
  });

  socket.on("answer", (data) => {
    const { gameId, questionId, answerIds } = data;
    const game = GAMES.find((g) => g.gameId == gameId && g.phase == "IN_GAME");
    if (!game || game.currentQuestionPhase !== "SHOW_QUESTION") return;
    const player = game.players.find((p) => p.socket.id == socket.id);
    if (!player) return;
    if (!game.template.questions[game.currentQuestionIndex].id == questionId)
      return; // validate answer is for the current question
    player.answers = answerIds; // set answer ids in player

    if (
      game.players
        .map((p) => p.answers)
        .flat()
        .filter((a) => a != null).length >=
      game.template.questions[game.currentQuestionIndex].correctAnswerIds
        .length *
        game.players.length
    ) {
      evaluateQuestion(game);
      game.currentQuestionIndex++;
      if (game.template.questions.length - 1 > game.currentQuestionIndex) {
        nextQuestion(game);
      } else {
        io.to(game.gameId).emit(
          "game-finished",
          game.players.map((p) => {
            return { id: p.id, displayName: p.displayName, score: p.score };
          })
        );
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
