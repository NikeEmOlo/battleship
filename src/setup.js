const frienemyRadio = document.querySelector("#frienemy");
const frienemyName = document.querySelector("#name-2-wrap");
const frienemyNameInput = document.querySelector("#name-2");
let formData;

export function formValidation(e) {
  switch (e.target.id) {
    case "frienemy":
    case "computer":
      frienemyName.classList.toggle("two-player", frienemyRadio.checked);
      frienemyNameInput.required = frienemyRadio.checked ? true : false;
      break;
  }
}

export function formSubmission(form) {
  formData = Object.fromEntries(new FormData(form));
  console.log(formData);
}
