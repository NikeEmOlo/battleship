import { createGameBoard } from "./gameboard.js";
import { chooseAttack } from "./computer.js";

// Default layout: carrier runs down the first column from [0, 0] to [4, 0]

test("attacks a square on the board", () => {
  const board = createGameBoard();
  const [x, y] = chooseAttack(board);

  expect(board.coordValidation([[x, y]])).toBe(true);
});

test("after a hit, attacks an adjacent square", () => {
  const board = createGameBoard();
  board.receiveAttack([2, 0]);

  for (let i = 0; i < 20; i++) {
    expect([
      [1, 0],
      [3, 0],
      [2, 1],
    ]).toContainEqual(chooseAttack(board));
  }
});

test("after two hits in a row, carries on along the line", () => {
  const board = createGameBoard();
  board.receiveAttack([2, 0]);
  board.receiveAttack([3, 0]);

  for (let i = 0; i < 20; i++) {
    expect([
      [1, 0],
      [4, 0],
    ]).toContainEqual(chooseAttack(board));
  }
});

test("stops chasing a ship once it is sunk", () => {
  const board = createGameBoard();
  board.receiveAttack([3, 8]);
  board.receiveAttack([4, 8]);
  board.receiveAttack([0, 0]);

  for (let i = 0; i < 20; i++) {
    expect([
      [1, 0],
      [0, 1],
    ]).toContainEqual(chooseAttack(board));
  }
});

test("sinks a whole fleet without repeating a square", () => {
  const board = createGameBoard();
  board.placeRandomly();

  let turns = 0;
  while (!board.allSunk) {
    expect(board.receiveAttack(chooseAttack(board))).not.toBe(null);
    turns++;
  }

  expect(turns).toBeLessThanOrEqual(100);
});
