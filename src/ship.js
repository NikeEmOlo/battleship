const shipTypes = {
  carrier: 5,
  battleship: 4,
  destroyer: 3,
  submarine: 3,
  patrol: 2,
};

export function createShip(ship) {
  let hits = 0;
  let coords = [];
  const size = shipTypes[ship];

  return {
    ship,
    get size() {
      return size;
    },
    hit: () => (hits += 1),
    isSunk: () => hits >= size,
    get hits() {
      return hits;
    },

    get coords() {
      return coords;
    },
    get placed() {
      return coords.length > 0;
    },
    setCoords(newCoords) {
      coords = newCoords;
    },
  };
}
