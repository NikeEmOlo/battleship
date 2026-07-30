import { createPlayer } from "./player.js";

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

function gameSetup(formData) {
  const player1 = createPlayer("human", formData.name);
  const player2 =
    formData.opponent === "computer"
      ? createPlayer("computer")
      : createPlayer("human", formData["name-2"]);
}
