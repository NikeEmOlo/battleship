import { createGameBoard } from "./gameboard.js";

export function createPlayer(type, name = "Ye who shall not be named") {
  const playerName = type === "human" ? name : "Compootah";
  const board = createGameBoard();

  return {
    name: playerName,
    board,
  };
}
