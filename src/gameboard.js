import { createShip } from "./ship.js";

export function createGameBoard() {
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
  let direction = "hz";
  let shipsPlaced = 0;

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
        if (direction === "hz") {
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
    },

    toggleRotate() {
      direction = direction === "hz" ? "vt" : "hz";
      return direction;
    },

    removeShip(shipName) {
      const ship = fleet[shipName];
      if (!ship || !ship.placed) return false;
      ship.setCoords([]);
      shipsPlaced--;
      return true;
    },

    coordValidation(array) {
      return array.every(([x, y]) => x >= 0 && x <= 9 && y >= 0 && y <= 9);
    },

    isPlacementComplete() {
      return shipsPlaced >= 5 ? true : false;
    },

    getShipsPlaced() {
      return shipsPlaced;
    },
  };
}
