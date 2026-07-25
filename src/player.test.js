import { createPlayer } from "./player.js";

test("Create a new player", () => {
  let player1 = createPlayer("human", "Josh");
  expect(player1.name).toBe("Josh");
});

test("Create a new player", () => {
  let player1 = createPlayer("human");
  expect(player1.name).toBe("Ye who shall not be named");
});
