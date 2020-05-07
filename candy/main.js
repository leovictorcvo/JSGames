const candiesPerRowColum = 8;

const gameBoard = document.querySelector(".game-board");

const candyBackgrounds = [
  "url(images/red-candy.png)",
  "url(images/yellow-candy.png)",
  "url(images/orange-candy.png)",
  "url(images/purple-candy.png)",
  "url(images/green-candy.png)",
  "url(images/blue-candy.png)",
];

const getRandomCandy = () =>
  candyBackgrounds[Math.floor(Math.random() * candyBackgrounds.length)];

const board = [];

let candyBeingDragged,
  candyIdBeingDragged,
  candyBeingReplaced,
  candyIdBeingReplaced;

let score = 0;

const updateScore = (quantity, increment = true) => {
  score = increment ? score + quantity : quantity;
  document.getElementById("score").innerHTML = score;
};

const candyIsInFirstColumn = () =>
  candyIdBeingDragged % candiesPerRowColum === 0;

const candyIsInLastColumn = () =>
  candyIdBeingDragged % candiesPerRowColum === candiesPerRowColum - 1;

const candyIsInFirstRow = (candyId) => candyId < candiesPerRowColum;

const createBoard = () => {
  updateScore(0, false);
  for (let i = 0; i < candiesPerRowColum * candiesPerRowColum; i++) {
    const candy = document.createElement("div");
    candy.classList.add("candy");
    candy.style.backgroundImage = getRandomCandy();
    candy.setAttribute("draggable", true);
    candy.setAttribute("id", i);

    candy.addEventListener("dragstart", dragStart);
    candy.addEventListener("dragend", dragEnd);
    candy.addEventListener("dragover", dragOver);
    candy.addEventListener("dragenter", dragEnter);
    candy.addEventListener("drageleave", dragLeave);
    candy.addEventListener("drop", dragDrop);

    gameBoard.appendChild(candy);
    board.push(candy);
  }
};

function dragStart() {
  candyBeingDragged = this.style.backgroundImage;
  candyIdBeingDragged = parseInt(this.id);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {
  this.style.backgroundImage = "";
}

function dragDrop() {
  candyBeingReplaced = this.style.backgroundImage;
  candyIdBeingReplaced = parseInt(this.id);
}

function dragEnd() {
  //What is a valid move?
  const validMoves = [
    candyIdBeingDragged - candiesPerRowColum,
    candyIdBeingDragged + candiesPerRowColum,
  ];
  if (!candyIsInFirstColumn()) {
    validMoves.push(candyIdBeingDragged - 1);
  }
  if (!candyIsInLastColumn()) {
    validMoves.push(candyIdBeingDragged + 1);
  }

  let validMove = validMoves.includes(candyIdBeingReplaced);

  if (candyIdBeingReplaced && validMove) {
    board[candyIdBeingReplaced].style.backgroundImage = candyBeingDragged;
    board[candyIdBeingDragged].style.backgroundImage = candyBeingReplaced;
    candyIdBeingReplaced = null;
    checkIfHasMatch();
  } else {
    board[candyIdBeingDragged].style.backgroundImage = candyBeingDragged;
  }
}

//drop candies once some have been cleared
const moveCandiesDown = () => {
  for (i = board.length - 1; i >= candiesPerRowColum; i--) {
    if (board[i].style.backgroundImage === "") {
      if (board[i - candiesPerRowColum].style.backgroundImage !== "") {
        board[i].style.backgroundImage =
          board[i - candiesPerRowColum].style.backgroundImage;
        board[i - candiesPerRowColum].style.backgroundImage = "";
      } else {
        board[i].style.backgroundImage = getRandomCandy();
      }
    }
  }
  //Generate candies in first line
  for (i = 0; i < candiesPerRowColum; i++) {
    if (board[i].style.backgroundImage === "") {
      board[i].style.backgroundImage = getRandomCandy();
    }
  }
  checkIfHasMatch();
};

///Checking for Matches
const checkMatches = (limit, generateValuesToCheck, restriction) => {
  let matchFound = false;
  for (let i = 0; i < limit; i++) {
    if (restriction && restriction(i)) continue;
    if (board[i].style.backgroundImage === "") continue;
    const valuesToCheck = generateValuesToCheck(i);
    const currentCandy = board[i].style.backgroundImage;
    if (
      valuesToCheck.every(
        (candyIndex) => board[candyIndex].style.backgroundImage === currentCandy
      )
    ) {
      valuesToCheck.push(i);
      valuesToCheck.forEach((index) => {
        board[index].style.backgroundImage = "";
      });
      updateScore(valuesToCheck.length);
      matchFound = true;
    }
  }
  return matchFound;
};

const checkMatchesInRows = (quantityOfMatches) => {
  const limit = board.length - quantityOfMatches;
  const generateValuesToCheck = (id) => {
    const valuesToCheck = [];
    for (let j = 1; j < quantityOfMatches; j++) {
      valuesToCheck.push(id + j);
    }
    return valuesToCheck;
  };
  const restriction = (id) =>
    id % candiesPerRowColum > candiesPerRowColum - quantityOfMatches;
  return checkMatches(limit, generateValuesToCheck, restriction);
};

const checkMatchesInColumns = (quantityOfMatches) => {
  const limit = board.length - (quantityOfMatches - 1) * candiesPerRowColum;
  const generateValuesToCheck = (id) => {
    const valuesToCheck = [];
    for (let j = 1; j < quantityOfMatches; j++) {
      valuesToCheck.push(id + j * candiesPerRowColum);
    }
    return valuesToCheck;
  };
  const restriction = null;
  return checkMatches(limit, generateValuesToCheck, restriction);
};

const checkIfHasMatch = () => {
  let matchFound = false;
  matchFound = checkMatchesInRows(5) || matchFound;
  matchFound = checkMatchesInColumns(5) || matchFound;
  matchFound = checkMatchesInRows(4) || matchFound;
  matchFound = checkMatchesInColumns(4) || matchFound;
  matchFound = checkMatchesInRows(3) || matchFound;
  matchFound = checkMatchesInColumns(3) || matchFound;

  if (matchFound) {
    setTimeout(() => {
      moveCandiesDown();
    }, 250);
  }
};

createBoard();
checkIfHasMatch();
