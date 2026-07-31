import { createPlayer } from "./player.js";

let players;
let p1;
let p2;
export function gameSetup(formData) {
  const player1 = createPlayer("human", formData.name);
  const player2 =
    formData.opponent === "computer"
      ? createPlayer("computer", "Compoota")
      : createPlayer("human", formData["name-2"]);

  players = { player1, player2 };
  p1 = player1;
  p2 = player2;

  return players;
}

export function rotateShips() {
  return p1.board.toggleRotate();
}
