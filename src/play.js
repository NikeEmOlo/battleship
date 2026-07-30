import { displayBoard } from "./dom.js";
import { formValidation } from "./setup.js";

const player1Board = document.querySelector("#player-1 .gameboard");

displayBoard(player1Board);

//================= EVENT LSNRS================//
const modal = document.querySelector("#choose-players");
modal.addEventListener("change", formValidation);
