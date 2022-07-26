"use strict";

//Select DOM elements
const display = document.getElementById("display-number");
const displayHistory = document.querySelector(".display-history");
const btnCal = document.querySelector(".keys");
const mainContainer = document.querySelector(".main-container");
const btnDarkMode = document.querySelector(".btn-switch input");
const btnDarkGrey = document.querySelectorAll(".btn-light--yellow");
const btnDark = document.querySelectorAll(".btn-dark");
const displayDarkMode = document.querySelector(".display-num--dark");

//GLOBLAL Variables
let accumulator = [];
let previousKeyOperator = false;

// DARK MODE //
btnDarkMode.addEventListener("change", darkMode);

function darkMode() {
  btnDarkGrey.forEach((element) => element.classList.toggle("btn-dark--grey"));

  btnDark.forEach((element) => element.classList.toggle("btn-dark--number"));

  mainContainer.classList.toggle("dark-mode");
  displayDarkMode.classList.toggle("btn-dark--number");
}

//CALCULATOR FUNCTIONABILITY
btnCal.addEventListener("click", selectKey);

function selectKey(e) {
  if (e.target.matches(".btnCal")) {
    const key = e.target;
    const operation = key.dataset.operation;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    let displayedNumber = display.textContent;
    let accumulatorString = "";
    let finalResult = 0;

    // Display number on screen
    if (!operation) {
      if (
        (displayedNumber == 0 &&
          accumulator.length === 0 &&
          action !== "decimal" &&
          !display.textContent.includes(".")) ||
        previousKeyOperator
      ) {
        display.textContent = keyContent;
        previousKeyOperator = false;
      } else if (action !== "=") {
        display.textContent += keyContent;
      } else {
        accumulator.push(displayedNumber);
      }
    } else {
      //Deny the user to add two consecutive operators
      if (!previousKeyOperator) {
        accumulator.push(display.textContent);
        accumulator.push(operation);
        previousKeyOperator = true;
      }
    }

    // Limit the number of numbers in the display
    if (display.textContent.length >= 8 || finalResult.length >= 8) {
      display.textContent = displayedNumber;
    }

    //Evaluate the operation and return the result
    if (action == "=") {
      console.log(accumulator);
      accumulatorString = accumulator.join(" ");
      finalResult = eval(accumulatorString);
      finalResult = Math.round(finalResult * 100) / 100;
      display.textContent = finalResult;
      if (finalResult == Infinity || finalResult == -Infinity) {
        display.textContent = "Error";
      }
      displayHistory.textContent = accumulatorString + " = ";
      // Log of the operations made
      console.log(accumulatorString + " = " + finalResult);
      if (!operation) {
        accumulator = [];
      }
    }

    // Clear display
    if (action === "clear") {
      display.textContent = 0;
      displayHistory.textContent = "";
      accumulator = [];
    }

    // Decimal display
    if (action === "decimal") {
      if (!display.textContent.includes(".")) {
        display.textContent = displayedNumber + keyContent;
      }
    }

    //Change sign when the user hits the +/- button and modify the accumulator array to let eval() know that the sign has changed
    if (action === "±") {
      // Change sign operation
      if (displayedNumber > 0) {
        displayedNumber = -Math.abs(displayedNumber);
        display.textContent = displayedNumber;
      } else {
        displayedNumber = Math.abs(displayedNumber);
        display.textContent = displayedNumber;
      }
      //Modify the array to change the sign of the number
      if (accumulator.includes("±")) {
        for (let i = 0; i < accumulator.length; i++) {
          if (accumulator[i] === "±") {
            accumulator.splice(i, 1);
            accumulator.splice(i - 1, 1);
          }
        }
      }
    }
  }
}
