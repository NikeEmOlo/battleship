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

test("Have all ships been placed?", () => {
  expect(board.isPlacementComplete()).toBe(false);
});

test("How many ships are placed?", () => {
  expect(board.getShipsPlaced()).toBe(0);
});

test("toggle rotate value", () => {
  expect(board.toggleRotate()).toBe("vt");
});

test("Place a ship on the board", () => {
  board.placeShip([0, 0], "patrol");
  expect(board.getShipsPlaced()).toBe(1);
  expect(board.fleet.patrol.coords).toEqual([
    [0, 0],
    [1, 0],
  ]);
});

test("remove a ship from the board", () => {
  board.removeShip("patrol");
  expect(board.getShipsPlaced()).toBe(0);
  expect(board.fleet.patrol.coords).toEqual([]);
});
