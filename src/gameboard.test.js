import { createGameBoard } from "./gameboard.js";

const board = createGameBoard();
test("Create a gameboard for player 1", () => {
  expect(board.fleet.carrier.size).toBe(5);
  expect(board.fleet).toMatchObject({
    carrier: { name: "carrier", size: 5 },
    battleship: { name: "battleship", size: 4 },
    destroyer: { name: "destroyer", size: 3 },
    submarine: { name: "submarine", size: 3 },
    patrol: { name: "patrol", size: 2 },
  });
});

test("coordinate validation", () => {
  let coords = [
    [0, 0],
    [1, 0],
    [2, 0],
  ];
  expect(board.coordValidation(coords)).toBe(true);
});

test("How many ships are placed?", () => {
  expect(board.shipsPlaced).toBe(0);
});

test("toggle rotate value", () => {
  expect(board.toggleRotate()).toBe("vt");
});

test("toggle rotate value", () => {
  expect(board.toggleRotate()).toBe("hz");
});

test("Place a ship on the board", () => {
  board.placeShip([0, 0], "patrol");
  expect(board.shipsPlaced).toBe(1);
  expect(board.fleet.patrol.coords).toEqual([
    [0, 0],
    [0, 1],
  ]);
});

test("receive an attack on a ship", () => {
  expect(board.receiveAttack([0, 1])).toBe(false);
  expect(board.receiveAttack([0, 0])).toBe(true);
});

test("receive a missed attack", () => {
  board.receiveAttack([6, 3]);
  expect(board.missed).toEqual([[6, 3]]);
});

test("remove a ship from the board", () => {
  board.removeShip("patrol");
  expect(board.shipsPlaced).toBe(0);
  expect(board.fleet.patrol.coords).toEqual([]);
});
