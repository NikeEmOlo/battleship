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

  //Gameboard management
  let ready = false;
  let missed = [];
  let hits = [];

  return {
    fleet,

    shipCoords(location, shipName) {
      // Which cells a ship would occupy from this starting cell
      const ship = fleet[shipName];
      if (!ship) return [];
      const [x, y] = location;
      let coords = [];

      for (let i = 0; i < ship.size; i++) {
        if (ship.rotation === "hz") {
          coords.push([x, y + i]);
        } else {
          coords.push([x + i, y]);
        }
      }
      return coords;
    },

    placeShip(location, shipName) {
      //Needs to know which ship and which cell is the starting cell
      // Starting cell and point for rotation
      const ship = fleet[shipName];
      if (!ship) return false;

      const coords = this.shipCoords(location, shipName);

      // If coords are valid, place the ship, otherwise throw an error
      if (this.coordValidation(coords) && this.cellsFree(coords, shipName)) {
        ship.setCoords(coords);
        return true;
      } else {
        return false;
      }
    },

    placeRandomly() {
      // Clears the board, then drops each ship somewhere it fits
      const ships = Object.values(fleet);
      ships.forEach((ship) => ship.setCoords([]));

      ships.forEach((ship) => {
        let placed = false;
        while (!placed) {
          if (Math.random() < 0.5) ship.toggleRotation();
          const start = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
          ];
          placed = this.placeShip(start, ship.name);
        }
      });
    },

    removeShip(shipName) {
      const ship = fleet[shipName];
      if (!ship || !ship.placed) return false;
      ship.setCoords([]);
      if (ready) this.toggleReady();
      return true;
    },

    coordValidation(array) {
      return array.every(([x, y]) => x >= 0 && x <= 9 && y >= 0 && y <= 9);
    },

    cellsFree(array, shipName) {
      // Every cell held by the rest of the fleet - the ship itself doesn't block
      const taken = Object.values(fleet)
        .filter((ship) => ship.name !== shipName)
        .flatMap((ship) => ship.coords);

      return array.every(
        ([x, y]) => !taken.some(([tx, ty]) => tx === x && ty === y),
      );
    },

    toggleReady() {
      ready = !ready;
    },

    attacked(coord) {
      const [x, y] = coord;
      return [...hits, ...missed].some(([ax, ay]) => ax === x && ay === y);
    },

    receiveAttack(coord) {
      const [x, y] = coord;
      if (this.attacked(coord)) return null;

      // Search the fleet for any ship occupying this coordinate
      for (const ship of Object.values(fleet)) {
        const found = ship.coords.some(([cx, cy]) => cx === x && cy === y);
        if (found) {
          ship.hit();
          hits.push(coord);
          return ship.isSunk();
        }
      }

      // No ship matched - recorded in array
      missed.push(coord);
    },

    get missed() {
      return missed;
    },

    get hits() {
      return hits;
    },

    get sunk() {
      return Object.values(fleet).filter((ship) => ship.isSunk());
    },

    get shipsPlaced() {
      return Object.values(fleet).filter((ship) => ship.placed).length;
    },

    get allSunk() {
      return Object.values(fleet).every((ship) => ship.isSunk());
    },
  };
}
