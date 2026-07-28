import { createGameBoard } from "./gameboard.js";

export function createPlayer(type, name = "Ye who shall not be named") {
  const playerName = type === "human" ? name : "Compoota";
  const board = createGameBoard();

  return {
    name: playerName,
    board,
  };
}
