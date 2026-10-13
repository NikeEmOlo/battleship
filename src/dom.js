import { gameSetup } from "./setup.js";
import { gameState } from "./play.js";
import { chooseAttack } from "./computer.js";

let p1;
let p2;
let active = "p1";
let heldShip = null;
let heldCoords = null;
let blocked = false;
let grabOffset = 0;
let turnTaken = false;

const shipImgs = {
  carrier: "/carrier.png",
  battleship: "/battleship.png",
  destroyer: "/destroyer.png",
  submarine: "/submarine.png",
  patrol: "/patrol.png",
};

const setupBoard = document.querySelector(".gameboard");
const attackBoard = document.querySelector("#attack-board .gameboard");
const sidebar = document.querySelector(".sidebar");
const miniMap = sidebar.querySelector(".mini-map .gameboard");
const scores = sidebar.querySelector(".scores");
const turnEl = document.querySelector(".turn");
const statusEl = document.querySelector(".status");
const endTurnBtn = sidebar.querySelector(".end-turn");
const turnPopup = document.querySelector(".turn-popup");
const passDialog = document.querySelector("#pass-device");
const winnerScreen = document.querySelector("#winner");

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

function displayFleet(
  player,
  board,
  ships = Object.values(player.board.fleet),
) {
  // displays all ships, or only the ones passed in
  ships.forEach((ship) => {
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

//-------------------- Battle --------------------//

function displayShots(owner, board) {
  // Marks every attack that has been made against the owner's fleet
  board
    .querySelectorAll(".tile")
    .forEach((tile) => tile.classList.remove("hit", "miss", "sunk"));

  owner.board.hits.forEach((coord) =>
    tileOn(board, coord).classList.add("hit"),
  );
  owner.board.missed.forEach((coord) =>
    tileOn(board, coord).classList.add("miss"),
  );
  owner.board.sunk
    .flatMap((ship) => ship.coords)
    .forEach((coord) => tileOn(board, coord).classList.add("sunk"));
}

function displayAttackBoard() {
  // The opponent's waters: only their sunk ships are revealed
  const opponent = getOpponent();
  clearFleet(attackBoard);
  displayShots(opponent, attackBoard);
  displayFleet(opponent, attackBoard, opponent.board.sunk);
}

function displayMiniMap() {
  // The active player's own fleet and the damage it has taken
  const player = getActivePlayer();
  clearFleet(miniMap);
  displayShots(player, miniMap);
  displayFleet(player, miniMap);
}

function displayScores() {
  // A player's score is the damage done to the other player's fleet
  [
    ["p1", p1, p2],
    ["p2", p2, p1],
  ].forEach(([key, player, opponent]) => {
    const hits = opponent.board.hits.length;
    const shots = hits + opponent.board.missed.length;
    const stats = {
      th: player.name,
      ".shots": shots,
      ".hits": hits,
      ".sunk": opponent.board.sunk.length,
    };

    // The winner screen has its own, fuller copy of the table
    document.querySelectorAll(`.scores [data-player="${key}"]`).forEach((row) =>
      Object.entries(stats).forEach(([selector, value]) => {
        const cell = row.querySelector(selector);
        if (cell) cell.textContent = value;
      }),
    );
  });
}

function displayTurn(key = active) {
  // Whose go it is, on the banner and the scoreboard
  const computer = gameState.mode === "computer";
  const name = key === "p1" ? p1.name : p2.name;

  if (computer) {
    turnEl.textContent = key === "p1" ? "Your turn" : "Computer's turn";
  } else {
    const nameEl = document.createElement("span");
    nameEl.textContent = name;
    turnEl.replaceChildren(nameEl, "'s turn");
  }
  turnEl.dataset.player = key;

  scores
    .querySelectorAll("tbody tr")
    .forEach((row) =>
      row.classList.toggle("active", row.dataset.player === key),
    );
}

function passDevice() {
  // Hides the boards until the next player has the computer
  passDialog.querySelector("p").textContent =
    `Pass the computer to ${getActivePlayer().name}`;
  passDialog.show();
}

function startTurn() {
  turnTaken = false;
  endTurnBtn.hidden = true;
  statusEl.textContent = "Pick a square to attack";
  displayTurn();
  displayAttackBoard();
  displayMiniMap();
  displayScores();
}

function attack(tile) {
  const opponent = getOpponent();
  const coord = [+tile.dataset.x, +tile.dataset.y];
  if (turnTaken || opponent.board.attacked(coord)) return;

  const sunk = opponent.board.receiveAttack(coord);
  turnTaken = true;

  displayAttackBoard();
  displayScores();
  if (sunk) {
    statusEl.textContent = `You sank ${opponent.name}'s ${shipAt(opponent, coord).name}!`;
  } else {
    statusEl.textContent = sunk === undefined ? "Miss!" : "Hit!";
  }

  if (opponent.board.allSunk) {
    gameOver();
  } else if (gameState.mode === "computer") {
    computerTurn();
  } else {
    endTurnBtn.hidden = false;
  }
}

async function computerTurn() {
  // The computer attacks p1's fleet on the mini-map, no screen change needed
  await wait(900);
  displayTurn("p2");
  statusEl.textContent = "";
  turnPopup.hidden = false;
  await wait(900);

  const coord = chooseAttack(p1.board);
  const tile = tileOn(miniMap, coord);
  tile.classList.add("target");
  await wait(900);
  tile.classList.remove("target");

  const sunk = p1.board.receiveAttack(coord);
  displayMiniMap();
  displayScores();
  turnPopup.hidden = true;

  let result = "missed.";
  if (sunk) result = `sank your ${shipAt(p1, coord).name}!`;
  else if (sunk === false) result = "hit your ship!";

  statusEl.textContent = `${p2.name} ${result}`;
  if (p1.board.allSunk) {
    gameOver();
  } else {
    displayTurn("p1");
    turnTaken = false;
  }
}

function endTurn() {
  toggleActive();
  passDevice();
}

async function gameOver() {
  // Whoever has no ships left is the loser
  const [key, winner, loser] = p2.board.allSunk
    ? ["p1", p1, p2]
    : ["p2", p2, p1];
  const computer = gameState.mode === "computer";

  const nameEl = document.createElement("span");
  nameEl.textContent = winner.name;
  const title = winnerScreen.querySelector("h1");
  title.replaceChildren(nameEl, " wins!");
  if (computer && key === "p1") title.textContent = "You win!";

  winnerScreen.querySelector(".summary").textContent =
    computer && key === "p2"
      ? "All of your ships are sunk."
      : `All of ${loser.name}'s ships are sunk.`;
  winnerScreen.dataset.player = key;
  winnerScreen
    .querySelectorAll("tbody tr")
    .forEach((row) =>
      row.classList.toggle("active", row.dataset.player === key),
    );
  displayScores();

  // Leave the final shot on screen for a moment first
  await wait(1800);
  attackBoard.parentElement.hidden = true;
  sidebar.hidden = true;
  winnerScreen.hidden = false;
}

function startGame() {
  document.querySelector("#setup-board").hidden = true;
  document.querySelector(".context").hidden = true;
  attackBoard.parentElement.hidden = false;
  sidebar.hidden = false;

  active = "p1";
  if (gameState.mode === "computer") {
    p2.board.placeRandomly();
    startTurn();
  } else {
    passDevice();
  }
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

function getOpponent() {
  return active === "p1" ? p2 : p1;
}

function tileOn(board, [x, y]) {
  return board.querySelector(`[data-index="${x * 10 + y}"]`);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shipAt(player, [x, y]) {
  return Object.values(player.board.fleet).find((ship) =>
    ship.coords.some(([sx, sy]) => sx === x && sy === y),
  );
}

function clearFleet(board) {
  board.querySelectorAll(".ship").forEach((ship) => ship.remove());
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

function nextHandler() {
  if (heldShip) return;

  if (gameState.mode === "twoPlayer" && active === "p1") {
    clearFleet(setupBoard);
    toggleActive();
    displayFleet(p2, setupBoard);
    continueBtn.querySelector("img").src = "/play_button.png";
  } else {
    startGame();
  }
}

//================= EVENT LSNRS================//
const modal = document.querySelector("#choose-players");
const modalForm = modal.querySelector("form");
const continueBtn = document.querySelector(".continue");

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

continueBtn.addEventListener("click", nextHandler);

attackBoard.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (tile) attack(tile);
});

endTurnBtn.addEventListener("click", endTurn);
passDialog.addEventListener("close", startTurn);
winnerScreen
  .querySelector(".play-again")
  .addEventListener("click", () => location.reload());
