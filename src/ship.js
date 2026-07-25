const shipTypes = {
  carrier: 5,
  battleship: 4,
  destroyer: 3,
  submarine: 3,
  patrol: 2,
};

export function createShip(name) {
  let hits = 0;
  let coords = [];
  const size = shipTypes[name];

  return {
    name,
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
      return coords.length >= 2 ? true : false;
    },
    setCoords(array) {
      coords = array;
    },
  };
}
