import { createShip } from "./ship.js";

test("creating a new carrier ship", () => {
  const p1Carrier = createShip("carrier");
  expect(p1Carrier.name).toBe("carrier");
  expect(p1Carrier.size).toBe(5);
  expect(p1Carrier.hits).toBe(0);
  expect(p1Carrier.isSunk()).toBe(false);
});

test("add hit to ship", () => {
  const ship = createShip("patrol");
  ship.hit();
  expect(ship.hits).toBe(1);
  expect(ship.isSunk()).toBe(false);
});

test("sink a ship", () => {
  const ship = createShip("submarine");
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("get ship size", () => {
  const ship = createShip("submarine");
  expect(ship.size).toBe(3);
});

test("set ship coordinates", () => {
  const ship = createShip("patrol");
  const coords = [
    [0, 0],
    [0, 1],
    [0, 2],
  ];
  ship.setCoords(coords);
  expect(ship.coords).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
});

test("Check if ship has been placed", () => {
  const ship = createShip("destroyer");
  const coords = [
    [0, 0],
    [0, 1],
    [0, 2],
  ];
  ship.setCoords(coords);
  expect(ship.placed).toBe(true);
});
