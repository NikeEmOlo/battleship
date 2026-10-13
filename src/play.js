import { displayBoard } from "./dom.js";

const setupBoard = document.querySelector("#setup-board .gameboard");

export const gameState = {
  _mode: null,
  get mode() {
    return this._mode;
  },
  set mode(value) {
    return (this._mode = value);
  },
};

displayBoard(setupBoard);
displayBoard(document.querySelector("#attack-board .gameboard"));
displayBoard(document.querySelector(".mini-map .gameboard"));
document.querySelectorAll("#winner .gameboard").forEach(displayBoard);
