import { createPlayer } from "./player.js";

export function gameSetup(formData) {
  const player1 = createPlayer("human", formData.name);
  const player2 =
    formData.opponent === "computer"
      ? createPlayer("computer")
      : createPlayer("human", formData["name-2"]);

  return { player1, player2 };
}
