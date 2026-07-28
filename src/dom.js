const player1Board = document.querySelector(".gameboard");

function createTile(index) {
  const x = Math.floor(index / 10);
  const y = index % 10;

  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.dataset.index = index;
  tile.dataset.x = x;
  tile.dataset.y = y;

  return tile;
}

function displayBoard(board) {
  for (let i = 0; i < 100; i++) {
    board.appendChild(createTile(i));
  }
}
