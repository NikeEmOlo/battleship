const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const same =
  ([ax, ay]) =>
  ([bx, by]) =>
    ax === bx && ay === by;

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function chooseAttack(board) {
  // Picks the next square to attack on an opponent's board
  const free = ([x, y]) =>
    x >= 0 && x <= 9 && y >= 0 && y <= 9 && !board.attacked([x, y]);

  // Hits on ships that are still afloat
  const sunk = board.sunk.flatMap((ship) => ship.coords);
  const open = board.hits.filter((hit) => !sunk.some(same(hit)));

  // Two hits in a row give the ship's direction away, so carry on along it
  const inLine = open.flatMap(([x, y]) =>
    directions
      .filter(([dx, dy]) => open.some(same([x + dx, y + dy])))
      .map(([dx, dy]) => [x - dx, y - dy]),
  );

  const adjacent = open.flatMap(([x, y]) =>
    directions.map(([dx, dy]) => [x + dx, y + dy]),
  );

  const everywhere = Array.from({ length: 100 }, (_, i) => [
    Math.floor(i / 10),
    i % 10,
  ]);

  for (const options of [inLine, adjacent, everywhere]) {
    const targets = options.filter(free);
    if (targets.length) return pick(targets);
  }
}
