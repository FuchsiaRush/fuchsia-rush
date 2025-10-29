import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  handleDisconnect,
  handleOnRoomJoin,
  handleStartGame,
  handleSubmitAnswer,
} from "./utils/game.js";
import { config } from "dotenv";
config();

const app = express();
const server = createServer(app);
export const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

let game_template = {
  id: "1f67d330-1948-44d6-b132-d389e07599d0",
  name: "Beispielspiel",
  questions: [
    {
      id: "55d7c464-7485-4cd5-82d7-63ff7282e200",
      text: "Frage XY",
      answers: [
        {
          id: "a9379a2d-04ae-46a9-a171-3ff6baae265c",
          value: "Falsch!",
        },
        {
          id: "8b86cae2-ff93-47ba-ae29-4a921517915c",
          value: "Richtig!",
        },
        {
          id: "af81c396-f3b8-42b1-981f-d1594bd29669",
          value: "Falsch!",
        },
      ],
      correctAnswerIds: ["8b86cae2-ff93-47ba-ae29-4a921517915c"],
      timeToAnswer: 30000,
      scoreMultiplier: 1,
    },
  ],
};

export let GAMES = [];

app.use("/", express.static("src/public"));

app.get("/api/v1/game-templates", (req, res) => {
  res.json([game_template]);
});

app.post("/api/v1/host-game", (req, res) => {
  const { templateId } = req.body;

  if (templateId !== game_template.id) {
    return res.status(400).json({ error: "Invalid template ID" });
  }

  const newGame = {
    gameId: Math.floor(100000 + Math.random() * 900000).toString(),
    host: {
      id: null,
      socket: null,
    },
    template: game_template,
    players: [],
    currentQuestionIndex: 0,
    currentQuestionPhase: "SHOW_QUESTION",
    phase: "LOBBY",
  };

  GAMES.push(newGame);

  res.json({ gameId: newGame.gameId });
});

io.on("connection", (socket) => {
  socket.on("join-room", (data) => handleOnRoomJoin(socket, data));

  socket.on("start-game", (data) => handleStartGame(socket, data));

  socket.on("submit-answer", (data) => handleSubmitAnswer(socket, data));

  socket.on("disconnect", () => handleDisconnect(socket));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
