const shipTypes = {
  carrier: {
    size: 5,
    start: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
    rotation: "vt",
  },
  battleship: {
    size: 4,
    start: [
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
    ],
    rotation: "vt",
  },
  destroyer: {
    size: 3,
    start: [
      [1, 6],
      [1, 7],
      [1, 8],
    ],
    rotation: "hz",
  },
  submarine: {
    size: 3,
    start: [
      [6, 6],
      [6, 7],
      [6, 8],
    ],
    rotation: "hz",
  },
  patrol: {
    size: 2,
    start: [
      [3, 8],
      [4, 8],
    ],
    rotation: "vt",
  },
};

export function createShip(name) {
  let hits = 0;
  let coords = shipTypes[name].start;
  const size = shipTypes[name].size;
  let rotation = shipTypes[name].rotation;

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

    get rotation() {
      return rotation;
    },
    toggleRotation() {
      rotation = rotation === "hz" ? "vt" : "hz";
      return rotation;
    },
  };
}
