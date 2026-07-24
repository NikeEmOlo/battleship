const shipTypes = {
  carrier: 5,
  battleship: 4,
  destroyer: 3,
  submarine: 3,
  patrol: 2,
};

export function createShip(name) {
  let hits = 0;
  let size = shipTypes[name];

  return {
    name,
    size,
    hit: () => (hits += 1),
    isSunk: () => hits >= size,
    get hits() {
      return hits;
    },
  };
}
