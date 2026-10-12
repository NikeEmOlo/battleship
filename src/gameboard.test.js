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
  expect(board.shipsPlaced).toBe(5);
});
test("remove a ship from the board", () => {
  board.removeShip("patrol");
  expect(board.shipsPlaced).toBe(4);
  expect(board.fleet.patrol.coords).toEqual([]);
});

test("Place a ship on the board", () => {
  board.placeShip([8, 0], "patrol");
  expect(board.shipsPlaced).toBe(5);
  expect(board.fleet.patrol.coords).toEqual([
    [8, 0],
    [9, 0],
  ]);
});

test("cells occupied by other ships are not free", () => {
  const board = createGameBoard();
  const carrier = board.fleet.carrier.coords;

  expect(board.cellsFree(carrier, "patrol")).toBe(false);
  expect(board.cellsFree([[9, 9]], "patrol")).toBe(true);
});

test("a ship does not block itself", () => {
  const board = createGameBoard();
  const carrier = board.fleet.carrier.coords;

  expect(board.cellsFree(carrier, "carrier")).toBe(true);
  expect(board.placeShip([0, 0], "carrier")).toBe(true);
});

test("a ship cannot be placed on top of another ship", () => {
  const board = createGameBoard();
  const before = board.fleet.patrol.coords;

  expect(board.placeShip([0, 0], "patrol")).toBe(false);
  expect(board.fleet.patrol.coords).toEqual(before);
});

test("receive an attack on a ship", () => {
  expect(board.receiveAttack([8, 0])).toBe(false);
  expect(board.receiveAttack([9, 0])).toBe(true);
});

test("Have all ships sunk", () => {
  expect(board.allSunk).toBe(false);
});

test("receive a missed attack", () => {
  board.receiveAttack([6, 3]);
  expect(board.missed).toEqual([[6, 3]]);
});

test("hits are recorded", () => {
  expect(board.hits).toEqual([
    [8, 0],
    [9, 0],
  ]);
});

test("a cell cannot be attacked twice", () => {
  expect(board.attacked([8, 0])).toBe(true);
  expect(board.attacked([6, 3])).toBe(true);
  expect(board.attacked([9, 9])).toBe(false);

  expect(board.receiveAttack([8, 0])).toBe(null);
  expect(board.receiveAttack([6, 3])).toBe(null);
  expect(board.hits.length).toBe(2);
  expect(board.missed.length).toBe(1);
  expect(board.fleet.patrol.hits).toBe(2);
});

test("sunk ships are listed", () => {
  expect(board.sunk.map((ship) => ship.name)).toEqual(["patrol"]);
});
