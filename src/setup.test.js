import { gameSetup, getPlayers } from "./setup.js";

let formDataComputer = { name: "Nike", opponent: "computer", "name-2": "" };
let formData2Player = { name: "Nike", opponent: "frienemy", "name-2": "Rival" };
test("Create game data", () => {
  const players = gameSetup(formDataComputer);

  expect(players.player1.name).toBe("Nike");
  expect(players.player2.name).toBe("Compoota");
});

test("Get player data", () => {
  gameSetup(formDataComputer);
  let players = getPlayers();
  expect(players.player1.name).toBe("Nike");
  expect(players.player2.name).toBe("Compoota");
});

test("Get player data with two players", () => {
  gameSetup(formData2Player);
  let players = getPlayers();
  expect(players.player1.name).toBe("Nike");
  expect(players.player2.name).toBe("Rival");
});
