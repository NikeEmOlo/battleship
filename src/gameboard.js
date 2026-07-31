import { createShip } from "./ship.js";

export function createGameBoard() {
  //Fleet / ship setup
  const fleetConfig = [
    "carrier",
    "battleship",
    "destroyer",
    "submarine",
    "patrol",
  ];
  const fleet = Object.fromEntries(
    fleetConfig.map((ship) => [ship, createShip(ship)]),
  );

  let shipsPlaced = 5;

  //Gameboard management
  let ready = false;
  let missed = [];

  return {
    fleet,

    placeShip(location, shipName) {
      //Needs to know which ship and which cell is the starting cell
      // Starting cell and point for rotation
      const ship = fleet[shipName];
      if (!ship) return false;
      const [x, y] = location;
      let coords = [];

      // Depending on ship size, build up each cell the ship occupies
      for (let i = 0; i < ship.size; i++) {
        if (ship.rotation === "hz") {
          coords.push([x, y + i]);
        } else {
          coords.push([x + i, y]);
        }
      }
      // If coords are valid, place the ship, otherwise throw an error
      if (this.coordValidation(coords)) {
        ship.setCoords(coords);
        shipsPlaced++;
        return true;
      } else {
        return false;
      }

      shipsPlaced >= 5 ? this.toggleReady() : null;
    },

    removeShip(shipName) {
      const ship = fleet[shipName];
      if (!ship || !ship.placed) return false;
      ship.setCoords([]);
      shipsPlaced--;
      if (ready) this.toggleReady();
      return true;
    },

    coordValidation(array) {
      return array.every(([x, y]) => x >= 0 && x <= 9 && y >= 0 && y <= 9);
    },

    toggleReady() {
      ready = !ready;
    },

    receiveAttack(coord) {
      const [x, y] = coord;

      // Search the fleet for any ship occupying this coordinate
      for (const ship of Object.values(fleet)) {
        const found = ship.coords.some(([cx, cy]) => cx === x && cy === y);
        if (found) {
          ship.hit();
          return ship.isSunk();
        }
      }

      // No ship matched - recorded in array
      missed.push(coord);
    },

    get missed() {
      return missed;
    },

    get shipsPlaced() {
      return shipsPlaced;
    },

    get allSunk() {
      return Object.values(fleet).every((ship) => ship.isSunk());
    },
  };
}
