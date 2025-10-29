import { GAMES, io } from "../app.js";
import { randomUUID } from "crypto";

export function handleOnRoomJoin(socket, data) {
  const { gameId, displayName } = data;
  if (!gameId || !displayName) return socket.disconnect();
  const game = GAMES.find((g) => g.gameId == gameId && g.phase == "LOBBY");
  if (!game) return socket.disconnect();

  socket.join(gameId);
  if (!game.host.socket) {
    game.host.socket = socket;
    socket.emit("lobby-state", []);
    // game.host.id = randomUUID(); // Not used currently
  } else {
    const player = {
      id: randomUUID(),
      displayName,
      score: 0,
      answers: null,
    };

    socket.emit(
      "lobby-state",
      game.players.map((p) => {
        return { id: p.id, displayName: p.displayName };
      })
    );
    io.to(game.gameId).emit("new-player", {
      id: player.id,
      displayName: player.displayName,
    });

    player.socket = socket;
    game.players.push(player);
  }
}

export function handleStartGame(socket, data) {
  const { gameId } = data;
  if (!gameId) return;
  const game = GAMES.find((g) => g.gameId == gameId && g.phase == "LOBBY");
  if (!game) return;
  if (game.host.socket.id !== socket.id) return;
  game.phase = "IN_GAME";
  nextQuestion(game);
}

export function handleSubmitAnswer(socket, data) {
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
    game.template.questions[game.currentQuestionIndex].correctAnswerIds.length *
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
      // clean up game
      GAMES = GAMES.filter((g) => g.gameId !== game.gameId);
    }
  }
}

export function handleDisconnect(socket) {
  for (let game of GAMES) {
    if (game.host.socket?.id === socket.id) {
      // host disconnected, end game
      io.to(game.gameId).emit("host-left");
      GAMES = GAMES.filter((g) => g.gameId !== game.gameId);
      break;
    } else {
      const playerIndex = game.players.findIndex(
        (p) => p.socket.id === socket.id
      );
      if (playerIndex >= 0) {
        game.players.splice(playerIndex, 1);
        // const player = game.players[playerIndex];
        // io.to(game.gameId).emit("player-left", {
        //   id: player.id,
        //   displayName: player.displayName,
        // }); // maybe notify others later
        break;
      }
    }
  }
}

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
