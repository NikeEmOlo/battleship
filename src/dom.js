import { gameSetup } from "./setup.js";
const shipImgs = {
  carrier: "/carrier.png",
  battleship: "/battleship.png",
  destroyer: "/destroyer.png",
  submarine: "/submarine.png",
  patrol: "/patrol.png",
};

const gameBoard = document.querySelector(".gameboard");

// Creates a tile on the gameboard
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

// Creates 100 tiles and appends them to the gameboard
export function displayBoard(board) {
  for (let i = 0; i < 100; i++) {
    board.appendChild(createTile(i));
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

// Displays a single ship
function displayShip(shipEl, ship) {
  const xs = ship.coords.map(([x]) => x);
  const ys = ship.coords.map(([, y]) => y);

  shipEl.style.gridRow = `${Math.min(...xs) + 1} / ${Math.max(...xs) + 2}`;
  shipEl.style.gridColumn = `${Math.min(...ys) + 1} / ${Math.max(...ys) + 2}`;
  shipEl.classList.toggle("hz", ship.rotation === "hz");
}

// Display's the entire fleet at correct coordinates
function displayFleet(fleet) {
  Object.values(fleet).forEach((ship) => {
    let shipEl = document.createElement("img");
    shipEl.src = shipImgs[ship.name];
    shipEl.dataset.name = ship.name;
    shipEl.classList.add("ship");
    shipEl.style.setProperty("--ship-length", ship.size);

    displayShip(shipEl, ship);
    gameBoard.appendChild(shipEl);
  });
}

// Switches the orientation of a ship
function displayShipRotation(shipEl) {
  shipEl.classList.toggle("hz");
}

//================= EVENT LSNRS================//
const modal = document.querySelector("#choose-players");
const modalForm = modal.querySelector("form");

modalForm.addEventListener("change", formValidation);
modalForm.addEventListener("submit", (e) => {
  let formData = Object.fromEntries(new FormData(e.currentTarget));
  let playerData = gameSetup(formData);
  displayFleet(playerData.player1.board.fleet);
});

