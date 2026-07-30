import { createGameBoard } from "./gameboard.js";

export function createPlayer(type, name) {
  const playerName = name;
  const board = createGameBoard();

  return {
    name: playerName,
    board,
  };
}
