import { gameSetup } from "./setup.js";
import { gameState } from "./play.js";

let p1;
let p2;
let active = "p1";
let heldShip = null;
let heldCoords = null;
let blocked = false;
let grabOffset = 0;

const shipImgs = {
  carrier: "/carrier.png",
  battleship: "/battleship.png",
  destroyer: "/destroyer.png",
  submarine: "/submarine.png",
  patrol: "/patrol.png",
};

const setupBoard = document.querySelector(".gameboard");

//============================================FUNCTIONS================//

//-------------------- Build game board-------------------//

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

export function displayBoard(board) {
  for (let i = 0; i < 100; i++) {
    board.appendChild(createTile(i));
  }
}

//-------------------- Displays Ships--------------------//

function displayShip(shipEl, coords, rotation) {
  // displays a single ship, placed or not
  const xs = coords.map(([x]) => x);
  const ys = coords.map(([, y]) => y);

  shipEl.style.gridRow = `${Math.min(...xs) + 1} / ${Math.max(...xs) + 2}`;
  shipEl.style.gridColumn = `${Math.min(...ys) + 1} / ${Math.max(...ys) + 2}`;
  shipEl.classList.toggle("hz", rotation === "hz");
}

function displayFleet(player, board) {
  // displays all ships
  const fleet = player.board.fleet;
  Object.values(fleet).forEach((ship) => {
    let shipEl = document.createElement("img");
    shipEl.src = shipImgs[ship.name];
    shipEl.dataset.name = ship.name;
    shipEl.classList.add("ship");
    shipEl.style.setProperty("--ship-length", ship.size);

    displayShip(shipEl, ship.coords, ship.rotation);
    board.appendChild(shipEl);
  });
}

function moveShip(shipEl, e) {
  // Allows user to click and drag a ship to a new location
  let player = getActivePlayer();
  let name = shipEl.dataset.name;
  heldShip = player.board.fleet[name];

  // Remove pointer events from a ship that is "held"
  shipEl.classList.add("held");

  //Find out where the ship was clicked
  const tile = tileAt(e);
  const [gx, gy] = [+tile.dataset.x, +tile.dataset.y];
  const [sx, sy] = heldShip.coords[0];
  grabOffset = heldShip.rotation === "hz" ? gy - sy : gx - sx;

  heldCoords = heldShip.coords;
  blocked = false;
}

function showHeldShip(coords) {
  // Draws the held ship at coords, only committing it if the cells are free
  let player = getActivePlayer();
  heldCoords = coords;
  blocked = !player.board.cellsFree(coords, heldShip.name);

  if (!blocked) player.board.placeShip(coords[0], heldShip.name);

  const shipEl = shipElement(heldShip.name);
  shipEl.classList.toggle("blocked", blocked);
  displayShip(shipEl, coords, heldShip.rotation);
}

function moveHeldShip(e) {
  // Snaps the held ship to whichever tile the cursor is over
  let player = getActivePlayer();
  const tile = tileAt(e);
  if (!tile) return;

  const [hx, hy] = [+tile.dataset.x, +tile.dataset.y];
  const start =
    heldShip.rotation === "hz" ? [hx, hy - grabOffset] : [hx - grabOffset, hy];
  const coords = player.board.shipCoords(start, heldShip.name);

  if (player.board.coordValidation(coords)) showHeldShip(coords);
}

function rotateHeldShip() {
  // Rotates the held ship, leaving it alone if it would not fit
  let player = getActivePlayer();
  const [gx, gy] = heldCoords[grabOffset];

  heldShip.toggleRotation();

  const start =
    heldShip.rotation === "hz" ? [gx, gy - grabOffset] : [gx - grabOffset, gy];
  const coords = player.board.shipCoords(start, heldShip.name);

  if (!player.board.coordValidation(coords)) {
    heldShip.toggleRotation();
    return;
  }

  showHeldShip(coords);
}

function dropShip() {
  // Puts a held ship back down, refusing to drop it onto another ship
  if (blocked) return;

  shipElement(heldShip.name).classList.remove("held");
  heldShip = null;
  heldCoords = null;
}

// Form validation, ensures max two players at a time
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

//------------------Helpers---------------//
function toggleActive() {
  active = active === "p1" ? "p2" : "p1";
}

function getActivePlayer() {
  return active === "p1" ? p1 : p2;
}

function shipElement(name) {
  return setupBoard.querySelector(`[data-name="${name}"]`);
}

function tileAt(e) {
  return document
    .elementsFromPoint(e.clientX, e.clientY)
    .find((el) => el.classList.contains("tile"));
}
//=====================EVENT HANDLERS==========================//

function submitHandler(formData) {
  // When form is submitted
  let players = gameSetup(formData);
  p1 = players.player1;
  p2 = players.player2;

  gameState.mode = formData.opponent === "computer" ? "computer" : "twoPlayer";
  console.log(gameState);
  displayFleet(p1, setupBoard);
}

// Event handler for anything that happens on a ghameboard
function gameBoardHandler(e) {
  if (heldShip) {
    dropShip();
  } else if (e.target.classList.contains("ship")) {
    moveShip(e.target, e);
  }
}

//================= EVENT LSNRS================//
const modal = document.querySelector("#choose-players");
const modalForm = modal.querySelector("form");

modalForm.addEventListener("change", formValidation);
modalForm.addEventListener("submit", (e) => {
  let formData = Object.fromEntries(new FormData(e.currentTarget));
  console.log(formData);
  submitHandler(formData);
});

setupBoard.addEventListener("click", gameBoardHandler);

setupBoard.addEventListener("mousemove", (e) => {
  if (heldShip) moveHeldShip(e);
});

document.addEventListener("keydown", (e) => {
  if (heldShip && e.key === "r") rotateHeldShip();
});
