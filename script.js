const inputs = Array.from(document.querySelectorAll(".inputValue"));
const scrambledWord = document.querySelector(".scrambled-word");
const mistakenLetters = document.querySelector("#mistaken-letters");
const randomBtn = document.querySelector("#random-btn");
const resetBtn = document.querySelector("#reset-btn");
let WrongAnswersCounter = 0;
let ActualWord;
window.addEventListener("load", () => generateWord());
// Generating and then adding the random word to DOM
async function generateWord() {
  //Loading animation:
  scrambledWord.classList.add("loading");
  let ApiUrl = "https://random-word-api.herokuapp.com/word?length=6";
  const response = await fetch(ApiUrl);
  const word = await response.json();
  ActualWord = word[0].toUpperCase();
  console.log(`Answer: ${ActualWord}`);
  scrambleWord(ActualWord);
}

function scrambleWord(word) {
  let letters = word.split("");

  letters.forEach((letter, index) => {
    const randomNum = Math.floor(Math.random() * (index + 1));
    [letters[index], letters[randomNum]] = [letters[randomNum], letters[index]];
  });
  updateWord(letters.join(""));
}

function updateWord(word) {
  scrambledWord.classList.remove("loading");
  scrambledWord.innerHTML = word;
  inputs[0].focus();
}

function resetAllInputs(deleteScrambledWord) {
  if (deleteScrambledWord) scrambledWord.innerHTML = "";
  inputs.forEach((input) => (input.value = ""));
  Array.from(document.querySelectorAll("[data-tried]")).forEach((elem) =>
    elem.removeAttribute("data-tried")
  );
  inputs.forEach((e) => e.classList.remove("bounce"));
  inputs[0].parentElement.classList.remove("match-found");
  mistakenLetters.innerHTML = "";
  inputs[0].focus();
}

// buttons control logic
randomBtn.addEventListener("click", () => {
  resetAllInputs(true);
  generateWord();
});

resetBtn.addEventListener("click", () => {
  resetAllInputs();
});

function evaluateAnswer() {
  let userInputWord = "";
  inputs.forEach((letter) => {
    userInputWord += letter.value.toUpperCase();
  });
  if (userInputWord === ActualWord) {
    guessedTheCorrectWord();
  } else {
    wrongInput(userInputWord);
  }
}
async function guessedTheCorrectWord() {
  inputs.forEach((input, index) => {
    setTimeout(() => {
      input.classList.add("bounce");
    }, index * 100);
    setTimeout(() => {
      inputs[0].parentElement.classList.add("match-found");
    }, 0);
  });
}

function wrongInput(userInputWord) {
  console.log("wrong entries!");
  for (let i = 0; i < inputs.length; i++) {
    setTimeout(() => {
      if (userInputWord.charAt(i) === ActualWord.charAt(i)) {
        // Letter on its correct position
        inputs[i].style.outlineColor = "rgb(9, 236, 9)";
        inputs[i].style.backgroundColor = "rgba(85, 172, 53, 0.292)";
      } else {
        // Incorrect letter.
        inputs[i].style.outlineColor = "red";
        inputs[i].style.backgroundColor = "rgba(172, 53, 53, 0.266)";
      }
    }, i * 500);
    setTimeout(() => {
      // console.log("remove color", i)
      inputs[i].style.outlineColor = "#4a5567";
      inputs[i].style.backgroundColor = "#030616";
    }, i * 250 + 2000);
  }

  const findNextTry = document.querySelector(".tries:not([data-tried])");
  findNextTry.setAttribute("data-tried", "");
}

// Handling events:
inputs.forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key == "Backspace" && e.target.value !== "") {
      console.log("delete Current input")
      e.target.value = "";
    } else if (["Backspace", "ArrowLeft", "ArrowDown"].includes(e.key)) {
      console.log("move back")
      const index = inputs.indexOf(e.target);
      if (index - 1 >= 0) inputs[index - 1].focus();
    } else if(["Arrowleft", "ArrowUp"].includes(e.key)) {

    }
    else {
      /* adding delay for the proper input of current Input field
       and after that move to next field */
      setTimeout(()=> moveToNextAndCheck(e.target, e.key), 0);
    }
  }); 
});

function moveToNextAndCheck(currentInput, key) {
  console.log("Next input")
  const allvaluesEntered = inputs.every((input) => input.value !== "");
  if (allvaluesEntered && !["ArrowRight", "ArrowUp"].includes(key)) {
    console.log("Check the Inputs !")
    evaluateAnswer(); 
    return;
  }
  const index = inputs.indexOf(currentInput);
  if (index < inputs.length - 1) {
    inputs[index + 1].focus();
    console.log("moved next")
  } 
}