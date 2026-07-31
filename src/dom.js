import { gameSetup } from "./setup.js";

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

// 1. Creates a gameboard with 100 tiles
export function displayBoard(board) {
  for (let i = 0; i < 100; i++) {
    board.appendChild(createTile(i));
  }
}

// 2. Form validation, ensures max two players at a time
const frienemyRadio = document.querySelector("#frienemy");
const frienemyName = document.querySelector("#name-2-wrap");
const frienemyNameInput = document.querySelector("#name-2");

export function formValidation(e) {
  switch (e.target.id) {
    case "frienemy":
    case "computer":
      frienemyName.classList.toggle("two-player", frienemyRadio.checked);
      frienemyNameInput.required = frienemyRadio.checked ? true : false;
      break;
  }
}

// 3. Measures the size of gameboard tiles to set the size of boats
const gameboard = document.querySelector(".gameboard");
function syncTileSize() {
  const tile = gameboard.querySelector(".tile");
  if (!tile) return;
  const { width } = tile.getBoundingClientRect();
  document.documentElement.style.setProperty("--tile-size", `${width}px`);
}
new ResizeObserver(syncTileSize).observe(gameboard);

//================= EVENT LSNRS================//
const modal = document.querySelector("#choose-players");
const modalForm = modal.querySelector("form");

modalForm.addEventListener("change", formValidation);
modalForm.addEventListener("submit", (e) => {
  let formData = Object.fromEntries(new FormData(e.currentTarget));
  let playerData = gameSetup(formData);
  console.log(playerData);
});
