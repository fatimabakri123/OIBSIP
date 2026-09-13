/* ==========================================
   DOM ELEMENTS
========================================== */

const expressionDisplay =
    document.getElementById("expression");

const resultDisplay =
    document.getElementById("result");

const errorMessage =
    document.getElementById("error-message");


/* ==========================================
   CALCULATOR STATE
========================================== */

let currentInput = "0";

let previousInput = null;

let currentOperator = null;

let shouldResetInput = false;


/* ==========================================
   DISPLAY
========================================== */

function updateDisplay() {

    resultDisplay.textContent =
        currentInput;

    if (
        previousInput !== null &&
        currentOperator !== null
    ) {

        expressionDisplay.textContent =
            `${previousInput} ${getDisplayOperator(currentOperator)}`;

    } else {

        expressionDisplay.textContent =
            "0";
    }
}


/* ==========================================
   OPERATOR DISPLAY
========================================== */

function getDisplayOperator(operator) {

    switch (operator) {

        case "+":
            return "+";

        case "-":
            return "−";

        case "*":
            return "×";

        case "/":
            return "÷";

        default:
            return operator;
    }
}


/* ==========================================
   CLEAR ERROR
========================================== */

function clearError() {

    errorMessage.textContent = "";
}


/* ==========================================
   SHOW ERROR
========================================== */

function showError(message) {

    errorMessage.textContent = message;

    currentInput = "Error";

    previousInput = null;

    currentOperator = null;

    shouldResetInput = true;

    updateDisplay();
}


/* ==========================================
   ADD NUMBER
========================================== */

function inputNumber(number) {

    clearError();

    /*
     * If the calculator is waiting
     * for a new number, start fresh.
     */

    if (shouldResetInput) {

        currentInput = number;

        shouldResetInput = false;

        updateDisplay();

        return;
    }


    /*
     * Prevent multiple zeros
     */

    if (
        currentInput === "0" &&
        number === "0"
    ) {
        return;
    }


    /*
     * Replace initial zero
     */

    if (
        currentInput === "0" &&
        number !== "."
    ) {

        currentInput = number;

    } else {

        currentInput += number;
    }


    updateDisplay();
}


/* ==========================================
   DECIMAL POINT
========================================== */

function inputDecimal() {

    clearError();

    if (shouldResetInput) {

        currentInput = "0.";

        shouldResetInput = false;

        updateDisplay();

        return;
    }


    /*
     * Don't allow more than
     * one decimal point.
     */

    if (currentInput.includes(".")) {
        return;
    }

    currentInput += ".";

    updateDisplay();
}


/* ==========================================
   OPERATOR
========================================== */

function chooseOperator(operator) {

    clearError();

    /*
     * Ignore operator if current input
     * is invalid.
     */

    if (currentInput === "Error") {
        return;
    }


    /*
     * If an operator already exists,
     * calculate the previous operation first.
     *
     * Example:
     *
     * 5 + 3 ×
     *
     * becomes:
     *
     * 8 ×
     */

    if (
        currentOperator !== null &&
        previousInput !== null &&
        !shouldResetInput
    ) {

        const calculation =
            calculate(
                parseFloat(previousInput),
                parseFloat(currentInput),
                currentOperator
            );


        if (calculation === null) {
            return;
        }

        currentInput =
            formatResult(calculation);
    }


    previousInput =
        parseFloat(currentInput);

    currentOperator =
        operator;

    shouldResetInput = true;

    updateDisplay();
}


/* ==========================================
   CALCULATE
========================================== */

function calculate(firstNumber, secondNumber, operator) {

    switch (operator) {

        case "+":

            return firstNumber + secondNumber;


        case "-":

            return firstNumber - secondNumber;


        case "*":

            return firstNumber * secondNumber;


        case "/":

            /*
             * Prevent division by zero.
             */

            if (secondNumber === 0) {

                showError(
                    "Cannot divide by zero"
                );

                return null;
            }

            return firstNumber / secondNumber;


        default:

            return secondNumber;
    }
}


/* ==========================================
   EQUALS
========================================== */

function calculateResult() {

    clearError();

    /*
     * Nothing to calculate.
     */

    if (
        currentOperator === null ||
        previousInput === null
    ) {
        return;
    }


    const firstNumber =
        parseFloat(previousInput);

    const secondNumber =
        parseFloat(currentInput);


    /*
     * Make the calculation.
     */

    const calculation =
        calculate(
            firstNumber,
            secondNumber,
            currentOperator
        );


    /*
     * Division by zero
     * already handled.
     */

    if (calculation === null) {
        return;
    }


    currentInput =
        formatResult(calculation);


    /*
     * Reset operator state.
     */

    previousInput = null;

    currentOperator = null;

    shouldResetInput = true;


    /*
     * Show final expression.
     */

    expressionDisplay.textContent =
        `${firstNumber} ${getDisplayOperator(currentOperator || "")} ${secondNumber}`;


    resultDisplay.textContent =
        currentInput;
}


/* ==========================================
   FORMAT RESULT
========================================== */

function formatResult(number) {

    /*
     * Prevent extremely long
     * floating-point results.
     */

    if (!Number.isFinite(number)) {

        return "Error";
    }


    const rounded =
        Math.round(
            (number + Number.EPSILON) *
            100000000
        ) / 100000000;


    return String(rounded);
}


/* ==========================================
   CLEAR CALCULATOR
========================================== */

function clearCalculator() {

    currentInput = "0";

    previousInput = null;

    currentOperator = null;

    shouldResetInput = false;

    clearError();

    updateDisplay();
}


/* ==========================================
   BACKSPACE
========================================== */

function deleteLastCharacter() {

    clearError();


    /*
     * If the calculator is waiting
     * for a new input, don't delete.
     */

    if (shouldResetInput) {
        return;
    }


    /*
     * Don't delete the only zero.
     */

    if (currentInput.length <= 1) {

        currentInput = "0";

    } else {

        currentInput =
            currentInput.slice(
                0,
                -1
            );
    }


    /*
     * If deleting leaves "-"
     * or an empty string.
     */

    if (
        currentInput === "" ||
        currentInput === "-"
    ) {

        currentInput = "0";
    }


    updateDisplay();
}


/* ==========================================
   BUTTON EVENT LISTENERS
========================================== */

const numberButtons =
    document.querySelectorAll(
        "[data-number]"
    );


numberButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const value =
                    button.dataset.number;


                if (value === ".") {

                    inputDecimal();

                } else {

                    inputNumber(value);
                }

            }
        );
    }
);


/* ==========================================
   OPERATOR BUTTONS
========================================== */

const operatorButtons =
    document.querySelectorAll(
        "[data-operator]"
    );


operatorButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const operator =
                    button.dataset.operator;

                chooseOperator(operator);
            }
        );
    }
);


/* ==========================================
   CLEAR BUTTON
========================================== */

const clearButton =
    document.querySelector(
        '[data-action="clear"]'
    );


clearButton.addEventListener(
    "click",
    clearCalculator
);


/* ==========================================
   DELETE BUTTON
========================================== */

const deleteButton =
    document.querySelector(
        '[data-action="delete"]'
    );


deleteButton.addEventListener(
    "click",
    deleteLastCharacter
);


/* ==========================================
   EQUALS BUTTON
========================================== */

const equalsButton =
    document.querySelector(
        '[data-action="equals"]'
    );


equalsButton.addEventListener(
    "click",
    calculateResult
);


/* ==========================================
   INITIAL DISPLAY
========================================== */

updateDisplay();