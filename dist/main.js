/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ai.js":
/*!*******************!*\
  !*** ./src/ai.js ***!
  \*******************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aiAttack: () => (/* binding */ aiAttack),
/* harmony export */   findAdjacentFieldOnAxis: () => (/* binding */ findAdjacentFieldOnAxis)
/* harmony export */ });
let hits = 0;
let hitedShip;
let hitedField;
let tempHitedField;

function isMoveLegal(x, y, board) {
  if (x > 9 || x < 0 || y < 0 || y > 9) return false;
  if (board[x][y].hit === true) return false;
  return true;
}
function findRandomMove() {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);

  return [x, y];
}

function findFourAdjacentFields(field, board) {
  const x = field.position[0];
  const y = field.position[1];
  const possibleFields = [
    [x, y + 1],
    [x, y - 1],
    [x + 1, y],
    [x - 1, y],
  ];
  const targetFields = possibleFields.filter((field) =>
    isMoveLegal(field[0], field[1], board.getBoard()),
  );
  return targetFields;
}

function findAdjacentFieldOnAxis(fieldOne, fieldTwo, board) {
  let a = fieldOne.position[0];
  let b = fieldOne.position[1];
  let x = fieldTwo.position[0];
  let y = fieldTwo.position[1];
  const possibleFields = [];
  let axis;
  

  if (a === x) {
    axis = "horizontal";
  } else if (b === y) {
    axis = "vertical";
  }
  console.log(axis)
  if (axis === "horizontal") {
    if (b > y) {
        a = fieldTwo.position[0]
        b = fieldTwo.position[1]
        x = fieldOne.position[0]
        y = fieldOne.position[1]
    }
    const targetFieldOne = [a, b - 1];
    const targetFieldTwo = [x, y + 1];
    possibleFields.push(targetFieldOne, targetFieldTwo);
  } else if (axis === "vertical") {
    if (a > x) {
        a = fieldTwo.position[0]
        b = fieldTwo.position[1]
        x = fieldOne.position[0]
        y = fieldOne.position[1]
        // console.log(a, b)
        // console.log(x, y)
    }
    const targetFieldOne = [a - 1, b];
    const targetFieldTwo = [x + 1, y];
    possibleFields.push(targetFieldOne, targetFieldTwo);
  }

  console.log(possibleFields, 'possible fields')
//   console.log(isMoveLegal(possibleFields[0][0], possibleFields[0][1], board.getBoard()))
//   console.log(isMoveLegal(possibleFields[1][0], possibleFields[1][1], board.getBoard()))
  const targetFields = possibleFields.filter((field) => {
    return isMoveLegal(field[0], field[1], board.getBoard());
  });
  console.log(targetFields, 'target fields')
  return targetFields;
}

// Na razie ai po 1 trafieniu uderza w jeden z czterech slotów w okół
function aiAttack(board) {
  if (hitedShip !== undefined && hitedShip.isSunk() === true) {
    hits = 0;
    hitedShip = undefined;
  }
  if (hits === 1) {
    const adjacentFields = findFourAdjacentFields(hitedField, board);
    const randomNum = Math.floor(Math.random() * adjacentFields.length);
    const randomMove = adjacentFields[randomNum];
    tempHitedField = board.receiveAttack(...randomMove);
    if (tempHitedField.ship !== null) {
      hits += 1;
    }

    console.log(hitedShip);
    return;
  }

  if (hits > 1) {
    console.log('hitedField', hitedField, 'temp hited field', tempHitedField)
    const targetFields = findAdjacentFieldOnAxis(
      hitedField,
      tempHitedField,
      board,
    );
    const randomNum = Math.floor(Math.random() * targetFields.length);
    const randomMove = targetFields[randomNum];
    const newHitedField = board.receiveAttack(...randomMove);
    if (newHitedField.ship !== null) {
      tempHitedField = newHitedField;
      hits += 1;
    }
    return
  }
  let randomMove = findRandomMove();
  while (
    isMoveLegal(randomMove[0], randomMove[1], board.getBoard()) === false
  ) {
    randomMove = findRandomMove();
  }
  hitedField = board.receiveAttack(...randomMove);
  if (hitedField.ship !== null) {
    hitedShip = hitedField.ship;
    hits += 1;
  }
}



/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   domController: () => (/* binding */ domController)
/* harmony export */ });
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.js */ "./src/game.js");
/* harmony import */ var _gameboard_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameboard.js */ "./src/gameboard.js");



function domController() {
  const gameboardController = (0,_gameboard_js__WEBPACK_IMPORTED_MODULE_1__.gameboardFactory)();
  const gameController = (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.game)();
  const main = document.querySelector("main");
  const playerOneDisplay = document.querySelector(".player-one-board");
  const playerTwoDisplay = document.querySelector(".player-two-board");
  const switchPositionButton = document.querySelector(".switch-position");
  const fields = [];
  let playerOneGameboard = gameController.getPlayerOneGameboard();
  let gameMode = "init";
  let shipLength = 1;
  let x;
  let y;
  let position = "vertical";

  function renderField(field, boardDisplay) {
    const renderedField = document.createElement("div");
    renderedField.classList.add("field");
    if (field.ship !== null) {
      renderedField.classList.add("ship");
    }
    if (field.ship !== null && boardDisplay === playerTwoDisplay) {
        renderedField.classList.add("hidden");
      }
    if (field.ship !== null && field.ship.isSunk()) {
      renderedField.classList.add("sunk");
    }
    if (field.hit === true) {
      renderedField.classList.add("hit");
    }
    renderedField.board = field.board;
    renderedField.field = field;

    if (!fields.includes(field.postion)) {
      fields.push(field.position);
    }

    if (gameMode === "init") {
      renderedField.addEventListener("mouseover", highlightTargetField);
      renderedField.addEventListener("mouseout", unhighlightTargetFields);
      renderedField.addEventListener("click", placeShip);
      renderedField.addEventListener("click", changeGameMode);
    } else if (gameMode === "game") {
      renderedField.addEventListener("click", playOnClick);
    }

    boardDisplay.appendChild(renderedField);

    return renderedField;
  }

  function renderGameboard(board, boardDisplay) {
    boardDisplay.innerHTML = "";

    board.forEach((row) => {
      row.forEach((field) => {
        renderField(field, boardDisplay);
      });
    });
  }

  function renderGameboards(playerOneGameboard, playerTwoGameboard) {
    renderGameboard(playerOneGameboard, playerOneDisplay);
    renderGameboard(playerTwoGameboard, playerTwoDisplay);
  }

  function playOnClick(e) {
    // If clicked field is not on enemy board or it is not human player turn: return
    if (e.target.parentElement !== playerTwoDisplay) return;
    if (_game_js__WEBPACK_IMPORTED_MODULE_0__.playerOne.getPlayersTurn() !== true) return;
    if (e.target.field.hit === true) return;

    const x = e.target.field.position[0];
    const y = e.target.field.position[1];

    gameController.play(x, y);

    // This game ending condition is also present in game.js
    if (gameController.isGameFinished()) {
      const playerOneGameboard = gameController.getPlayerOneGameboard();
      const playerTwoGameboard = gameController.getPlayerTwoGameboard();
      renderGameboards(
        playerOneGameboard.getBoard(),
        playerTwoGameboard.getBoard(),
      );
      return;
    }
    renderGameboard(e.target.parentElement.board, e.target.parentElement);

    setTimeout(() => {
      gameController.play();
      renderGameboard(playerOneGameboard.getBoard(), playerOneDisplay);
    }, "1500");
  }

  // Start/End Game Popups

  function createEndGamePopup(winner) {
    const modal = document.createElement("div");
    modal.classList.add("end-game");
    modal.classList.add("modal");

    const text = document.createElement("p");
    text.classList.add("end-game-text");
    text.textContent = `${winner} Won`;

    const newGameButton = document.createElement("button");
    newGameButton.classList.add("new-game-button");
    newGameButton.textContent = "New Game";

    main.appendChild(modal);
    modal.appendChild(text);
    modal.appendChild(newGameButton);

    newGameButton.addEventListener("click", () => {
        resetDisplay()
        switchPositionButton.classList.toggle('hidden')
    })
  }

  function createStartGamePopup() {
    const modal = document.createElement("div");
    modal.classList.add("start-game");
    modal.classList.add("modal");

    const startGameButton = document.createElement("button");
    startGameButton.classList.add("start-game-button");
    startGameButton.textContent = "Start Game";

    main.appendChild(modal);
    modal.appendChild(startGameButton);

    startGameButton.addEventListener("click", () => {
      main.removeChild(modal);
      gameController.startGame();
      switchPositionButton.classList.toggle('hidden')
    });
  }

  function removeFieldsEventListeners() {
    const displayedFields = document.querySelectorAll(".field");

    displayedFields.forEach((field) => {
      field.removeEventListener("click", playOnClick);
    });
  }

  function resetDisplay() {
    const modal = document.querySelector(".modal");

    main.removeChild(modal);
    gameMode = "init";
    shipLength = 1;
    gameController.initGameboards();
  }

  // SHIP PLACING LOGIC

  function showTargetFields(e) {
    playerOneGameboard = gameController.getPlayerOneGameboard();

    playerOneDisplay.boardObject = playerOneGameboard;
    if (shipLength > 5) return;
    if (e.target.parentElement.boardObject !== playerOneGameboard) {

      return;
    }
    const renderedFields = Array.from(document.querySelectorAll(".field"));

    x = e.target.field.position[0];
    y = e.target.field.position[1];
    // const board = e.target.parentElement.board;
    const board = playerOneGameboard.getBoard();
    const targetFields = gameboardController.findTargetFields(
      shipLength,
      x,
      y,
      position,
      board,
    );
    let targetFieldsPositions;
    let displayedTargetFields;
    if (targetFields !== false) {
      targetFieldsPositions = targetFields.map((field) => field.position);
      displayedTargetFields = renderedFields.filter(
        (field) =>
          targetFieldsPositions.includes(field.field.position) === true,
      );
    }
    if (displayedTargetFields) {
      return displayedTargetFields;
    }
  }

  function highlightTargetField(e) {
    const targetFields = showTargetFields(e);
    if (targetFields) {
      targetFields.forEach((field) => field.classList.add("active"));
    }
  }

  function unhighlightTargetFields(e) {
    const targetFields = showTargetFields(e);
    if (targetFields) {
      targetFields.forEach((field) => field.classList.remove("active"));
    }
  }

  function placeShip(e) {
    if (shipLength > 5 || e.target.parentElement === playerTwoDisplay) {
      return;
    }
    const boardObject = playerOneGameboard;
    const board = playerOneGameboard.getBoard();
    const displayedBoard = playerOneDisplay;

    const ship = boardObject.placeShip(shipLength, x, y, position);
    if (ship !== false) {
      renderGameboard(board, displayedBoard);
      shipLength += 1;
    }
    if (shipLength > 5) createStartGamePopup();
  }

  function changeGameMode() {
    const playerOneGameboard = gameController.getPlayerOneGameboard();
    const playerTwoGameboard = gameController.getPlayerTwoGameboard();
    if (shipLength > 5) gameMode = "game";
    if (shipLength < 5) gameMode = "init";
    renderGameboards(
      playerOneGameboard.getBoard(),
      playerTwoGameboard.getBoard(),
    );
  }

  function switchPosition() {
    switch (position) {
      case "vertical":
        position = "horizontal";
        break;
      case "horizontal":
        position = "vertical";
        break;
    }
  }

  switchPositionButton.addEventListener("click", switchPosition);

  return {
    renderGameboards,
    createEndGamePopup,
    removeFieldsEventListeners,
    playerOneDisplay,
    playerTwoDisplay,
  };
}


/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   game: () => (/* binding */ game),
/* harmony export */   playerOne: () => (/* binding */ playerOne),
/* harmony export */   playerTwo: () => (/* binding */ playerTwo)
/* harmony export */ });
/* harmony import */ var _gameboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard.js */ "./src/gameboard.js");
/* harmony import */ var _player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player.js */ "./src/player.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom.js */ "./src/dom.js");




let playerOneGameboard 
let playerTwoGameboard 
const getPlayerOneGameboard = () => playerOneGameboard
const getPlayerTwoGameboard = () => playerTwoGameboard
const playerOne = (0,_player_js__WEBPACK_IMPORTED_MODULE_1__.player)(false, true);
const playerTwo = (0,_player_js__WEBPACK_IMPORTED_MODULE_1__.player)(true, false);
const dom = (0,_dom_js__WEBPACK_IMPORTED_MODULE_2__.domController)(
  playerOne,
  playerTwo,
);
function game() {
  function initGameboards() {
    const playerOneDisplay = dom.playerOneDisplay
    const playerTwoDisplay = dom.playerTwoDisplay
    playerOneGameboard = (0,_gameboard_js__WEBPACK_IMPORTED_MODULE_0__.gameboardFactory)();
    playerTwoGameboard = (0,_gameboard_js__WEBPACK_IMPORTED_MODULE_0__.gameboardFactory)();
    playerOneGameboard.initGameboard();
    playerTwoGameboard.initGameboard();
    playerOneDisplay.board = playerOneGameboard.getBoard()
    playerTwoDisplay.board = playerTwoGameboard.getBoard()
    dom.renderGameboards(playerOneGameboard.getBoard(), playerTwoGameboard.getBoard());
  }

  function startGame() {
    playerOne.setPlayersTurn(true);
    playerTwo.setPlayersTurn(false);

    playerTwoGameboard.placeShipsRandomly(5);
    dom.renderGameboards(playerOneGameboard.getBoard(), playerTwoGameboard.getBoard());
  }

  function play(x, y) {
    const playerOneTurn = playerOne.getPlayersTurn();
    const playerTwoTurn = playerTwo.getPlayersTurn();

    if (playerOneTurn === true) {
      playerOne.attack(playerTwoGameboard, playerTwo, x, y);
    } else if (playerTwoTurn === true) {
      playerTwo.attack(playerOneGameboard, playerOne);
    }

    if (isGameFinished()) {
      let winner = "";
      if (playerOneGameboard.areAllShipsSunk() === true) {
        winner = "Player Two";
      }
      if (playerTwoGameboard.areAllShipsSunk() === true) {
        winner = "Player One";
      }
      endGame(winner);
    }
  }

  function isGameFinished() {
    if (
      playerOneGameboard.areAllShipsSunk() === true ||
      playerTwoGameboard.areAllShipsSunk() === true
    ) {
      return true;
    }
    return false;
  }

  function endGame(winner) {
    dom.createEndGamePopup(winner);
    dom.removeFieldsEventListeners();
  }

  return {
    startGame,
    play,
    endGame,
    isGameFinished,
    initGameboards,
    getPlayerOneGameboard,
    getPlayerTwoGameboard
  };
}




/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   gameboardFactory: () => (/* binding */ gameboardFactory)
/* harmony export */ });
/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship.js */ "./src/ship.js");


const gameboardFactory = () => {
  const board = [];

  const getBoard = () => board;

  function createField(x, y) {
    return {
      position: [x, y],
      occupiedByShip: false,
      hit: false,
      ship: null,
      board: getBoard(),
    };
  }

  function initGameboard() {
    for (let i = 0; i < 10; i++) {
      const arr = [];
      for (let j = 0; j < 10; j++) {
        arr.push(createField(i, j));
      }
      board.push(arr);
    }
  }

  function printBoard() {
    board.forEach((row) => {
      let string = "";
      row.forEach((field) => {
        if (!field.occupiedByShip && !field.hit) {
          string += `| ${field.position} |`;
        } else if (!field.occupiedByShip && field.hit) {
          string += `|  -  |`;
        } else if (field.occupiedByShip && !field.hit) {
          string += "|  O  |";
        } else if (field.occupiedByShip && field.hit) {
          string += "|  X  |";
        }
      });
      console.log(string);
    });
  }

  function findNeighbourFields(targetFields) {
    if (!targetFields) return false;
    const board = getBoard();
    let duplicatedNeighbours = [];
    const neighbours = [];
    const possbileNeighbours = [];

    targetFields.forEach((field) => {
      const x = field.position[0];
      const y = field.position[1];

      // all the possible neighbour fields
      const possibleNeighboursCoordinates = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y],
        [x + 1, y - 1],
        [x, y - 1],
      ];

      // push the neighbour fields that are not out of bounds
      possibleNeighboursCoordinates.forEach((coordinate) => {
        if (isOutOfBound(coordinate[0], coordinate[1]) === false)
          possbileNeighbours.push(board[coordinate[0]][coordinate[1]]);
      });
    });

    // add only neighbours that are not included in the target fields array

    duplicatedNeighbours = possbileNeighbours.filter(
      (neighbour) => targetFields.includes(neighbour) === false,
    );

    duplicatedNeighbours.forEach((field) => {
      if (!neighbours.includes(field)) neighbours.push(field);
    });

    return neighbours;
  }

  function findTargetFields(shipLength, x, y, direction, board) {
    const targetFields = [];
    for (let i = 0; i < shipLength; i++) {
      if (direction === "horizontal") {
        if (isOutOfBound(x, y + i)) {
          console.log("out of bounds");
          return false;
        }
        targetFields.push(board[x][y + i]);
      } else if (direction === "vertical") {
        if (isOutOfBound(x + i, y)) {
          console.log("out of bounds");
          return false;
        }
        targetFields.push(board[x + i][y]);
      }
    }
    return targetFields;
  }

  function isOutOfBound(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 9) return true;
    return false;
  }

  function checkIfFieldOccupied(field) {
    return field.occupiedByShip === true;
  }

  function canShipBePlaced(targetFields, neighbourFields) {
    console.log(targetFields, "target fields");
    if (!targetFields) return false;

    // if fields are already occupied, or neighbour fields are occupied, return false
    if (
      targetFields.some(checkIfFieldOccupied) ||
      neighbourFields.some(checkIfFieldOccupied)
    ) {
      return false;
    }

    return true;
  }

  function placeShip(shipLength, x, y, direction = "horizontal") {
    const board = getBoard();
    const targetFields = findTargetFields(shipLength, x, y, direction, board);
    const neighbourFields = findNeighbourFields(targetFields);
    if (!canShipBePlaced(targetFields, neighbourFields)) {
      return false;
    }
    const ship = (0,_ship_js__WEBPACK_IMPORTED_MODULE_0__.shipFactory)(shipLength);

    targetFields.forEach((field) => {
      field.occupiedByShip = true;
      field.ship = ship;
    });
    return ship;
  }

  function placeShipsRandomly(amount) {
    const placedShips = [];
    let currentShipLenght = 1;
    while (placedShips.length !== amount) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const randomDirection = Math.floor(Math.random() * 2);
      let direction;

      switch (randomDirection) {
        case 1:
          direction = "vertical";
          break;
        case 0:
          direction = "horizontal";
          break;
      }

      const ship = placeShip(currentShipLenght, x, y, direction);

      if (ship !== false) {
        placedShips.push(ship);
        currentShipLenght++;
      }
    }
  }

  function receiveAttack(x, y) {
    if (isOutOfBound(x, y)) {
      console.log("out of bounds");
      return false;
    }

    if (board[x][y].hit) {
      console.log("field already hit");
      return false;
    }

    if (board[x][y].ship !== null) board[x][y].ship.hit();

    board[x][y].hit = true;
    // printBoard();
    return board[x][y]
  }

  function areAllShipsSunk() {
    const fieldsOccupiedByShips = [];
    board.forEach((row) => {
      const occupied = row.filter((field) => {
        return field.occupiedByShip === true;
      });
      fieldsOccupiedByShips.push(...occupied);
    });
    if (fieldsOccupiedByShips.every((field) => field.hit === true)) return true;
    return false;
  }

  return {
    createField,
    initGameboard,
    printBoard,
    getBoard,
    findTargetFields,
    findNeighbourFields,
    canShipBePlaced,
    placeShip,
    receiveAttack,
    areAllShipsSunk,
    placeShipsRandomly,
  };
};


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   player: () => (/* binding */ player)
/* harmony export */ });
/* harmony import */ var _ai_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ai.js */ "./src/ai.js");


const player = (ai, isItPlayersTurn) => {
  const isAi = ai;
  let playersTurn = isItPlayersTurn;
  const getPlayersTurn = () => playersTurn;
  const setPlayersTurn = (value) => {
    playersTurn = value
  }

  function changePlayersTurn(secondPlayer) {
    const secondPlayerTurn = secondPlayer.getPlayersTurn();
    switch (playersTurn) {
      case true:
        playersTurn = false;
        break;
      case false:
        playersTurn = true;
        break;
    }
    switch (secondPlayerTurn) {
      case true:
        secondPlayer.setPlayersTurn(false);
        break;
      case false:
        secondPlayer.setPlayersTurn(true);
        break;
    }
    
  }

  function attack(board, attackedPlayer, x, y) {
    changePlayersTurn(attackedPlayer);
    if (isAi) {
      console.log("player one turn", playersTurn);
      console.log("player two turn", attackedPlayer.getPlayersTurn());
      (0,_ai_js__WEBPACK_IMPORTED_MODULE_0__.aiAttack)(board, attackedPlayer);
    } else {
      console.log("player one turn", playersTurn);
      console.log("player two turn", attackedPlayer.getPlayersTurn());
      return board.receiveAttack(x, y);
    }
  }

  function findRandomMove() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    return [x, y];
  }

  function isMoveLegal(x, y, board) {
    if (board[x][y].hit === true) return false;
    return true;
  }

  // function aiAttack(board) {
  //   let randomMove = findRandomMove();
  //   while (
  //     isMoveLegal(randomMove[0], randomMove[1], board.getBoard()) === false
  //   ) {
  //     randomMove = findRandomMove();
  //   }
  //   console.log(...randomMove)
  //   return board.receiveAttack(...randomMove);
  // }

  return {
    attack,
    getPlayersTurn,
    setPlayersTurn,
    isMoveLegal,
    changePlayersTurn,
    findRandomMove
  };
};


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   shipFactory: () => (/* binding */ shipFactory)
/* harmony export */ });
const shipFactory = (length) => {
  
  let numberOfHits = 0;

  const getLength = () => length;
  const getNumberOfHits = () => numberOfHits

  const hit = () => {
    numberOfHits += 1
    return numberOfHits
  };

  const isSunk = () => {
    if (numberOfHits === length) return true;
    return false;
  };

  return {
    getLength,
    hit,
    isSunk,
    getNumberOfHits
  };
};

const ship = shipFactory(1);
ship.hit();

console.log(ship.getLength());



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.js */ "./src/game.js");
/* harmony import */ var _ai_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ai.js */ "./src/ai.js");




const gameController = (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.game)()


gameController.initGameboards()
const boardObject = gameController.getPlayerOneGameboard()
const playerOneBoard = gameController.getPlayerOneGameboard().getBoard()
console.log(boardObject.getBoard())
// console.log(playerOneBoard)
boardObject.printBoard()
console.log((0,_ai_js__WEBPACK_IMPORTED_MODULE_1__.findAdjacentFieldOnAxis)(playerOneBoard[6][7], playerOneBoard[5][7], boardObject))


window.startGame = gameController.startGame
window.endGame = gameController.endGame
// gameController.startGame()


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQzZDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2hJRDtBQUNNOztBQUUzQztBQUNQLDhCQUE4QiwrREFBZ0I7QUFDOUMseUJBQXlCLDhDQUFJO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsK0NBQVM7QUFDakI7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLFFBQVE7O0FBRWxDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbFFrRDtBQUNiO0FBQ0k7O0FBRXpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGtEQUFNO0FBQ3hCLGtCQUFrQixrREFBTTtBQUN4QixZQUFZLHNEQUFhO0FBQ3pCO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLCtEQUFnQjtBQUN6Qyx5QkFBeUIsK0RBQWdCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWdDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkZROztBQUVqQztBQUNQOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixRQUFRO0FBQzVCO0FBQ0Esc0JBQXNCLFFBQVE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QyxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixxREFBVzs7QUFFNUI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxTm1DOztBQUU1QjtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGdEQUFRO0FBQ2QsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUMzRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUN1Qjs7Ozs7OztVQzdCdkI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOaUM7QUFDaUI7OztBQUdsRCx1QkFBdUIsOENBQUk7OztBQUczQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLCtEQUF1Qjs7O0FBR25DO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYWkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBoaXRzID0gMDtcbmxldCBoaXRlZFNoaXA7XG5sZXQgaGl0ZWRGaWVsZDtcbmxldCB0ZW1wSGl0ZWRGaWVsZDtcblxuZnVuY3Rpb24gaXNNb3ZlTGVnYWwoeCwgeSwgYm9hcmQpIHtcbiAgaWYgKHggPiA5IHx8IHggPCAwIHx8IHkgPCAwIHx8IHkgPiA5KSByZXR1cm4gZmFsc2U7XG4gIGlmIChib2FyZFt4XVt5XS5oaXQgPT09IHRydWUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBmaW5kUmFuZG9tTW92ZSgpIHtcbiAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblxuICByZXR1cm4gW3gsIHldO1xufVxuXG5mdW5jdGlvbiBmaW5kRm91ckFkamFjZW50RmllbGRzKGZpZWxkLCBib2FyZCkge1xuICBjb25zdCB4ID0gZmllbGQucG9zaXRpb25bMF07XG4gIGNvbnN0IHkgPSBmaWVsZC5wb3NpdGlvblsxXTtcbiAgY29uc3QgcG9zc2libGVGaWVsZHMgPSBbXG4gICAgW3gsIHkgKyAxXSxcbiAgICBbeCwgeSAtIDFdLFxuICAgIFt4ICsgMSwgeV0sXG4gICAgW3ggLSAxLCB5XSxcbiAgXTtcbiAgY29uc3QgdGFyZ2V0RmllbGRzID0gcG9zc2libGVGaWVsZHMuZmlsdGVyKChmaWVsZCkgPT5cbiAgICBpc01vdmVMZWdhbChmaWVsZFswXSwgZmllbGRbMV0sIGJvYXJkLmdldEJvYXJkKCkpLFxuICApO1xuICByZXR1cm4gdGFyZ2V0RmllbGRzO1xufVxuXG5mdW5jdGlvbiBmaW5kQWRqYWNlbnRGaWVsZE9uQXhpcyhmaWVsZE9uZSwgZmllbGRUd28sIGJvYXJkKSB7XG4gIGxldCBhID0gZmllbGRPbmUucG9zaXRpb25bMF07XG4gIGxldCBiID0gZmllbGRPbmUucG9zaXRpb25bMV07XG4gIGxldCB4ID0gZmllbGRUd28ucG9zaXRpb25bMF07XG4gIGxldCB5ID0gZmllbGRUd28ucG9zaXRpb25bMV07XG4gIGNvbnN0IHBvc3NpYmxlRmllbGRzID0gW107XG4gIGxldCBheGlzO1xuICBcblxuICBpZiAoYSA9PT0geCkge1xuICAgIGF4aXMgPSBcImhvcml6b250YWxcIjtcbiAgfSBlbHNlIGlmIChiID09PSB5KSB7XG4gICAgYXhpcyA9IFwidmVydGljYWxcIjtcbiAgfVxuICBjb25zb2xlLmxvZyhheGlzKVxuICBpZiAoYXhpcyA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICBpZiAoYiA+IHkpIHtcbiAgICAgICAgYSA9IGZpZWxkVHdvLnBvc2l0aW9uWzBdXG4gICAgICAgIGIgPSBmaWVsZFR3by5wb3NpdGlvblsxXVxuICAgICAgICB4ID0gZmllbGRPbmUucG9zaXRpb25bMF1cbiAgICAgICAgeSA9IGZpZWxkT25lLnBvc2l0aW9uWzFdXG4gICAgfVxuICAgIGNvbnN0IHRhcmdldEZpZWxkT25lID0gW2EsIGIgLSAxXTtcbiAgICBjb25zdCB0YXJnZXRGaWVsZFR3byA9IFt4LCB5ICsgMV07XG4gICAgcG9zc2libGVGaWVsZHMucHVzaCh0YXJnZXRGaWVsZE9uZSwgdGFyZ2V0RmllbGRUd28pO1xuICB9IGVsc2UgaWYgKGF4aXMgPT09IFwidmVydGljYWxcIikge1xuICAgIGlmIChhID4geCkge1xuICAgICAgICBhID0gZmllbGRUd28ucG9zaXRpb25bMF1cbiAgICAgICAgYiA9IGZpZWxkVHdvLnBvc2l0aW9uWzFdXG4gICAgICAgIHggPSBmaWVsZE9uZS5wb3NpdGlvblswXVxuICAgICAgICB5ID0gZmllbGRPbmUucG9zaXRpb25bMV1cbiAgICAgICAgLy8gY29uc29sZS5sb2coYSwgYilcbiAgICAgICAgLy8gY29uc29sZS5sb2coeCwgeSlcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0RmllbGRPbmUgPSBbYSAtIDEsIGJdO1xuICAgIGNvbnN0IHRhcmdldEZpZWxkVHdvID0gW3ggKyAxLCB5XTtcbiAgICBwb3NzaWJsZUZpZWxkcy5wdXNoKHRhcmdldEZpZWxkT25lLCB0YXJnZXRGaWVsZFR3byk7XG4gIH1cblxuICBjb25zb2xlLmxvZyhwb3NzaWJsZUZpZWxkcywgJ3Bvc3NpYmxlIGZpZWxkcycpXG4vLyAgIGNvbnNvbGUubG9nKGlzTW92ZUxlZ2FsKHBvc3NpYmxlRmllbGRzWzBdWzBdLCBwb3NzaWJsZUZpZWxkc1swXVsxXSwgYm9hcmQuZ2V0Qm9hcmQoKSkpXG4vLyAgIGNvbnNvbGUubG9nKGlzTW92ZUxlZ2FsKHBvc3NpYmxlRmllbGRzWzFdWzBdLCBwb3NzaWJsZUZpZWxkc1sxXVsxXSwgYm9hcmQuZ2V0Qm9hcmQoKSkpXG4gIGNvbnN0IHRhcmdldEZpZWxkcyA9IHBvc3NpYmxlRmllbGRzLmZpbHRlcigoZmllbGQpID0+IHtcbiAgICByZXR1cm4gaXNNb3ZlTGVnYWwoZmllbGRbMF0sIGZpZWxkWzFdLCBib2FyZC5nZXRCb2FyZCgpKTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKHRhcmdldEZpZWxkcywgJ3RhcmdldCBmaWVsZHMnKVxuICByZXR1cm4gdGFyZ2V0RmllbGRzO1xufVxuXG4vLyBOYSByYXppZSBhaSBwbyAxIHRyYWZpZW5pdSB1ZGVyemEgdyBqZWRlbiB6IGN6dGVyZWNoIHNsb3TDs3cgdyBva8OzxYJcbmZ1bmN0aW9uIGFpQXR0YWNrKGJvYXJkKSB7XG4gIGlmIChoaXRlZFNoaXAgIT09IHVuZGVmaW5lZCAmJiBoaXRlZFNoaXAuaXNTdW5rKCkgPT09IHRydWUpIHtcbiAgICBoaXRzID0gMDtcbiAgICBoaXRlZFNoaXAgPSB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGhpdHMgPT09IDEpIHtcbiAgICBjb25zdCBhZGphY2VudEZpZWxkcyA9IGZpbmRGb3VyQWRqYWNlbnRGaWVsZHMoaGl0ZWRGaWVsZCwgYm9hcmQpO1xuICAgIGNvbnN0IHJhbmRvbU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFkamFjZW50RmllbGRzLmxlbmd0aCk7XG4gICAgY29uc3QgcmFuZG9tTW92ZSA9IGFkamFjZW50RmllbGRzW3JhbmRvbU51bV07XG4gICAgdGVtcEhpdGVkRmllbGQgPSBib2FyZC5yZWNlaXZlQXR0YWNrKC4uLnJhbmRvbU1vdmUpO1xuICAgIGlmICh0ZW1wSGl0ZWRGaWVsZC5zaGlwICE9PSBudWxsKSB7XG4gICAgICBoaXRzICs9IDE7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coaGl0ZWRTaGlwKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaGl0cyA+IDEpIHtcbiAgICBjb25zb2xlLmxvZygnaGl0ZWRGaWVsZCcsIGhpdGVkRmllbGQsICd0ZW1wIGhpdGVkIGZpZWxkJywgdGVtcEhpdGVkRmllbGQpXG4gICAgY29uc3QgdGFyZ2V0RmllbGRzID0gZmluZEFkamFjZW50RmllbGRPbkF4aXMoXG4gICAgICBoaXRlZEZpZWxkLFxuICAgICAgdGVtcEhpdGVkRmllbGQsXG4gICAgICBib2FyZCxcbiAgICApO1xuICAgIGNvbnN0IHJhbmRvbU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRhcmdldEZpZWxkcy5sZW5ndGgpO1xuICAgIGNvbnN0IHJhbmRvbU1vdmUgPSB0YXJnZXRGaWVsZHNbcmFuZG9tTnVtXTtcbiAgICBjb25zdCBuZXdIaXRlZEZpZWxkID0gYm9hcmQucmVjZWl2ZUF0dGFjayguLi5yYW5kb21Nb3ZlKTtcbiAgICBpZiAobmV3SGl0ZWRGaWVsZC5zaGlwICE9PSBudWxsKSB7XG4gICAgICB0ZW1wSGl0ZWRGaWVsZCA9IG5ld0hpdGVkRmllbGQ7XG4gICAgICBoaXRzICs9IDE7XG4gICAgfVxuICAgIHJldHVyblxuICB9XG4gIGxldCByYW5kb21Nb3ZlID0gZmluZFJhbmRvbU1vdmUoKTtcbiAgd2hpbGUgKFxuICAgIGlzTW92ZUxlZ2FsKHJhbmRvbU1vdmVbMF0sIHJhbmRvbU1vdmVbMV0sIGJvYXJkLmdldEJvYXJkKCkpID09PSBmYWxzZVxuICApIHtcbiAgICByYW5kb21Nb3ZlID0gZmluZFJhbmRvbU1vdmUoKTtcbiAgfVxuICBoaXRlZEZpZWxkID0gYm9hcmQucmVjZWl2ZUF0dGFjayguLi5yYW5kb21Nb3ZlKTtcbiAgaWYgKGhpdGVkRmllbGQuc2hpcCAhPT0gbnVsbCkge1xuICAgIGhpdGVkU2hpcCA9IGhpdGVkRmllbGQuc2hpcDtcbiAgICBoaXRzICs9IDE7XG4gIH1cbn1cbmV4cG9ydCB7IGFpQXR0YWNrLCBmaW5kQWRqYWNlbnRGaWVsZE9uQXhpcyB9O1xuIiwiaW1wb3J0IHsgZ2FtZSwgcGxheWVyT25lIH0gZnJvbSBcIi4vZ2FtZS5qc1wiO1xuaW1wb3J0IHsgZ2FtZWJvYXJkRmFjdG9yeSB9IGZyb20gXCIuL2dhbWVib2FyZC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gZG9tQ29udHJvbGxlcigpIHtcbiAgY29uc3QgZ2FtZWJvYXJkQ29udHJvbGxlciA9IGdhbWVib2FyZEZhY3RvcnkoKTtcbiAgY29uc3QgZ2FtZUNvbnRyb2xsZXIgPSBnYW1lKCk7XG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbiAgY29uc3QgcGxheWVyT25lRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLW9uZS1ib2FyZFwiKTtcbiAgY29uc3QgcGxheWVyVHdvRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLXR3by1ib2FyZFwiKTtcbiAgY29uc3Qgc3dpdGNoUG9zaXRpb25CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN3aXRjaC1wb3NpdGlvblwiKTtcbiAgY29uc3QgZmllbGRzID0gW107XG4gIGxldCBwbGF5ZXJPbmVHYW1lYm9hcmQgPSBnYW1lQ29udHJvbGxlci5nZXRQbGF5ZXJPbmVHYW1lYm9hcmQoKTtcbiAgbGV0IGdhbWVNb2RlID0gXCJpbml0XCI7XG4gIGxldCBzaGlwTGVuZ3RoID0gMTtcbiAgbGV0IHg7XG4gIGxldCB5O1xuICBsZXQgcG9zaXRpb24gPSBcInZlcnRpY2FsXCI7XG5cbiAgZnVuY3Rpb24gcmVuZGVyRmllbGQoZmllbGQsIGJvYXJkRGlzcGxheSkge1xuICAgIGNvbnN0IHJlbmRlcmVkRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJlbmRlcmVkRmllbGQuY2xhc3NMaXN0LmFkZChcImZpZWxkXCIpO1xuICAgIGlmIChmaWVsZC5zaGlwICE9PSBudWxsKSB7XG4gICAgICByZW5kZXJlZEZpZWxkLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgIH1cbiAgICBpZiAoZmllbGQuc2hpcCAhPT0gbnVsbCAmJiBib2FyZERpc3BsYXkgPT09IHBsYXllclR3b0Rpc3BsYXkpIHtcbiAgICAgICAgcmVuZGVyZWRGaWVsZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgfVxuICAgIGlmIChmaWVsZC5zaGlwICE9PSBudWxsICYmIGZpZWxkLnNoaXAuaXNTdW5rKCkpIHtcbiAgICAgIHJlbmRlcmVkRmllbGQuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gICAgfVxuICAgIGlmIChmaWVsZC5oaXQgPT09IHRydWUpIHtcbiAgICAgIHJlbmRlcmVkRmllbGQuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgICB9XG4gICAgcmVuZGVyZWRGaWVsZC5ib2FyZCA9IGZpZWxkLmJvYXJkO1xuICAgIHJlbmRlcmVkRmllbGQuZmllbGQgPSBmaWVsZDtcblxuICAgIGlmICghZmllbGRzLmluY2x1ZGVzKGZpZWxkLnBvc3Rpb24pKSB7XG4gICAgICBmaWVsZHMucHVzaChmaWVsZC5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKGdhbWVNb2RlID09PSBcImluaXRcIikge1xuICAgICAgcmVuZGVyZWRGaWVsZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIGhpZ2hsaWdodFRhcmdldEZpZWxkKTtcbiAgICAgIHJlbmRlcmVkRmllbGQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHVuaGlnaGxpZ2h0VGFyZ2V0RmllbGRzKTtcbiAgICAgIHJlbmRlcmVkRmllbGQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYWNlU2hpcCk7XG4gICAgICByZW5kZXJlZEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaGFuZ2VHYW1lTW9kZSk7XG4gICAgfSBlbHNlIGlmIChnYW1lTW9kZSA9PT0gXCJnYW1lXCIpIHtcbiAgICAgIHJlbmRlcmVkRmllbGQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXlPbkNsaWNrKTtcbiAgICB9XG5cbiAgICBib2FyZERpc3BsYXkuYXBwZW5kQ2hpbGQocmVuZGVyZWRGaWVsZCk7XG5cbiAgICByZXR1cm4gcmVuZGVyZWRGaWVsZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckdhbWVib2FyZChib2FyZCwgYm9hcmREaXNwbGF5KSB7XG4gICAgYm9hcmREaXNwbGF5LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICBib2FyZC5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICByZW5kZXJGaWVsZChmaWVsZCwgYm9hcmREaXNwbGF5KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyR2FtZWJvYXJkcyhwbGF5ZXJPbmVHYW1lYm9hcmQsIHBsYXllclR3b0dhbWVib2FyZCkge1xuICAgIHJlbmRlckdhbWVib2FyZChwbGF5ZXJPbmVHYW1lYm9hcmQsIHBsYXllck9uZURpc3BsYXkpO1xuICAgIHJlbmRlckdhbWVib2FyZChwbGF5ZXJUd29HYW1lYm9hcmQsIHBsYXllclR3b0Rpc3BsYXkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxheU9uQ2xpY2soZSkge1xuICAgIC8vIElmIGNsaWNrZWQgZmllbGQgaXMgbm90IG9uIGVuZW15IGJvYXJkIG9yIGl0IGlzIG5vdCBodW1hbiBwbGF5ZXIgdHVybjogcmV0dXJuXG4gICAgaWYgKGUudGFyZ2V0LnBhcmVudEVsZW1lbnQgIT09IHBsYXllclR3b0Rpc3BsYXkpIHJldHVybjtcbiAgICBpZiAocGxheWVyT25lLmdldFBsYXllcnNUdXJuKCkgIT09IHRydWUpIHJldHVybjtcbiAgICBpZiAoZS50YXJnZXQuZmllbGQuaGl0ID09PSB0cnVlKSByZXR1cm47XG5cbiAgICBjb25zdCB4ID0gZS50YXJnZXQuZmllbGQucG9zaXRpb25bMF07XG4gICAgY29uc3QgeSA9IGUudGFyZ2V0LmZpZWxkLnBvc2l0aW9uWzFdO1xuXG4gICAgZ2FtZUNvbnRyb2xsZXIucGxheSh4LCB5KTtcblxuICAgIC8vIFRoaXMgZ2FtZSBlbmRpbmcgY29uZGl0aW9uIGlzIGFsc28gcHJlc2VudCBpbiBnYW1lLmpzXG4gICAgaWYgKGdhbWVDb250cm9sbGVyLmlzR2FtZUZpbmlzaGVkKCkpIHtcbiAgICAgIGNvbnN0IHBsYXllck9uZUdhbWVib2FyZCA9IGdhbWVDb250cm9sbGVyLmdldFBsYXllck9uZUdhbWVib2FyZCgpO1xuICAgICAgY29uc3QgcGxheWVyVHdvR2FtZWJvYXJkID0gZ2FtZUNvbnRyb2xsZXIuZ2V0UGxheWVyVHdvR2FtZWJvYXJkKCk7XG4gICAgICByZW5kZXJHYW1lYm9hcmRzKFxuICAgICAgICBwbGF5ZXJPbmVHYW1lYm9hcmQuZ2V0Qm9hcmQoKSxcbiAgICAgICAgcGxheWVyVHdvR2FtZWJvYXJkLmdldEJvYXJkKCksXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZW5kZXJHYW1lYm9hcmQoZS50YXJnZXQucGFyZW50RWxlbWVudC5ib2FyZCwgZS50YXJnZXQucGFyZW50RWxlbWVudCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGdhbWVDb250cm9sbGVyLnBsYXkoKTtcbiAgICAgIHJlbmRlckdhbWVib2FyZChwbGF5ZXJPbmVHYW1lYm9hcmQuZ2V0Qm9hcmQoKSwgcGxheWVyT25lRGlzcGxheSk7XG4gICAgfSwgXCIxNTAwXCIpO1xuICB9XG5cbiAgLy8gU3RhcnQvRW5kIEdhbWUgUG9wdXBzXG5cbiAgZnVuY3Rpb24gY3JlYXRlRW5kR2FtZVBvcHVwKHdpbm5lcikge1xuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwiZW5kLWdhbWVcIik7XG4gICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcIm1vZGFsXCIpO1xuXG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHRleHQuY2xhc3NMaXN0LmFkZChcImVuZC1nYW1lLXRleHRcIik7XG4gICAgdGV4dC50ZXh0Q29udGVudCA9IGAke3dpbm5lcn0gV29uYDtcblxuICAgIGNvbnN0IG5ld0dhbWVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIG5ld0dhbWVCdXR0b24uY2xhc3NMaXN0LmFkZChcIm5ldy1nYW1lLWJ1dHRvblwiKTtcbiAgICBuZXdHYW1lQnV0dG9uLnRleHRDb250ZW50ID0gXCJOZXcgR2FtZVwiO1xuXG4gICAgbWFpbi5hcHBlbmRDaGlsZChtb2RhbCk7XG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQobmV3R2FtZUJ1dHRvbik7XG5cbiAgICBuZXdHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHJlc2V0RGlzcGxheSgpXG4gICAgICAgIHN3aXRjaFBvc2l0aW9uQnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVN0YXJ0R2FtZVBvcHVwKCkge1xuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwic3RhcnQtZ2FtZVwiKTtcbiAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwibW9kYWxcIik7XG5cbiAgICBjb25zdCBzdGFydEdhbWVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIHN0YXJ0R2FtZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwic3RhcnQtZ2FtZS1idXR0b25cIik7XG4gICAgc3RhcnRHYW1lQnV0dG9uLnRleHRDb250ZW50ID0gXCJTdGFydCBHYW1lXCI7XG5cbiAgICBtYWluLmFwcGVuZENoaWxkKG1vZGFsKTtcbiAgICBtb2RhbC5hcHBlbmRDaGlsZChzdGFydEdhbWVCdXR0b24pO1xuXG4gICAgc3RhcnRHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBtYWluLnJlbW92ZUNoaWxkKG1vZGFsKTtcbiAgICAgIGdhbWVDb250cm9sbGVyLnN0YXJ0R2FtZSgpO1xuICAgICAgc3dpdGNoUG9zaXRpb25CdXR0b24uY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJylcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUZpZWxkc0V2ZW50TGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IGRpc3BsYXllZEZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmllbGRcIik7XG5cbiAgICBkaXNwbGF5ZWRGaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgIGZpZWxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGF5T25DbGljayk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldERpc3BsYXkoKSB7XG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsXCIpO1xuXG4gICAgbWFpbi5yZW1vdmVDaGlsZChtb2RhbCk7XG4gICAgZ2FtZU1vZGUgPSBcImluaXRcIjtcbiAgICBzaGlwTGVuZ3RoID0gMTtcbiAgICBnYW1lQ29udHJvbGxlci5pbml0R2FtZWJvYXJkcygpO1xuICB9XG5cbiAgLy8gU0hJUCBQTEFDSU5HIExPR0lDXG5cbiAgZnVuY3Rpb24gc2hvd1RhcmdldEZpZWxkcyhlKSB7XG4gICAgcGxheWVyT25lR2FtZWJvYXJkID0gZ2FtZUNvbnRyb2xsZXIuZ2V0UGxheWVyT25lR2FtZWJvYXJkKCk7XG5cbiAgICBwbGF5ZXJPbmVEaXNwbGF5LmJvYXJkT2JqZWN0ID0gcGxheWVyT25lR2FtZWJvYXJkO1xuICAgIGlmIChzaGlwTGVuZ3RoID4gNSkgcmV0dXJuO1xuICAgIGlmIChlLnRhcmdldC5wYXJlbnRFbGVtZW50LmJvYXJkT2JqZWN0ICE9PSBwbGF5ZXJPbmVHYW1lYm9hcmQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByZW5kZXJlZEZpZWxkcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5maWVsZFwiKSk7XG5cbiAgICB4ID0gZS50YXJnZXQuZmllbGQucG9zaXRpb25bMF07XG4gICAgeSA9IGUudGFyZ2V0LmZpZWxkLnBvc2l0aW9uWzFdO1xuICAgIC8vIGNvbnN0IGJvYXJkID0gZS50YXJnZXQucGFyZW50RWxlbWVudC5ib2FyZDtcbiAgICBjb25zdCBib2FyZCA9IHBsYXllck9uZUdhbWVib2FyZC5nZXRCb2FyZCgpO1xuICAgIGNvbnN0IHRhcmdldEZpZWxkcyA9IGdhbWVib2FyZENvbnRyb2xsZXIuZmluZFRhcmdldEZpZWxkcyhcbiAgICAgIHNoaXBMZW5ndGgsXG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHBvc2l0aW9uLFxuICAgICAgYm9hcmQsXG4gICAgKTtcbiAgICBsZXQgdGFyZ2V0RmllbGRzUG9zaXRpb25zO1xuICAgIGxldCBkaXNwbGF5ZWRUYXJnZXRGaWVsZHM7XG4gICAgaWYgKHRhcmdldEZpZWxkcyAhPT0gZmFsc2UpIHtcbiAgICAgIHRhcmdldEZpZWxkc1Bvc2l0aW9ucyA9IHRhcmdldEZpZWxkcy5tYXAoKGZpZWxkKSA9PiBmaWVsZC5wb3NpdGlvbik7XG4gICAgICBkaXNwbGF5ZWRUYXJnZXRGaWVsZHMgPSByZW5kZXJlZEZpZWxkcy5maWx0ZXIoXG4gICAgICAgIChmaWVsZCkgPT5cbiAgICAgICAgICB0YXJnZXRGaWVsZHNQb3NpdGlvbnMuaW5jbHVkZXMoZmllbGQuZmllbGQucG9zaXRpb24pID09PSB0cnVlLFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGRpc3BsYXllZFRhcmdldEZpZWxkcykge1xuICAgICAgcmV0dXJuIGRpc3BsYXllZFRhcmdldEZpZWxkcztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoaWdobGlnaHRUYXJnZXRGaWVsZChlKSB7XG4gICAgY29uc3QgdGFyZ2V0RmllbGRzID0gc2hvd1RhcmdldEZpZWxkcyhlKTtcbiAgICBpZiAodGFyZ2V0RmllbGRzKSB7XG4gICAgICB0YXJnZXRGaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IGZpZWxkLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIikpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVuaGlnaGxpZ2h0VGFyZ2V0RmllbGRzKGUpIHtcbiAgICBjb25zdCB0YXJnZXRGaWVsZHMgPSBzaG93VGFyZ2V0RmllbGRzKGUpO1xuICAgIGlmICh0YXJnZXRGaWVsZHMpIHtcbiAgICAgIHRhcmdldEZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4gZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKGUpIHtcbiAgICBpZiAoc2hpcExlbmd0aCA+IDUgfHwgZS50YXJnZXQucGFyZW50RWxlbWVudCA9PT0gcGxheWVyVHdvRGlzcGxheSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBib2FyZE9iamVjdCA9IHBsYXllck9uZUdhbWVib2FyZDtcbiAgICBjb25zdCBib2FyZCA9IHBsYXllck9uZUdhbWVib2FyZC5nZXRCb2FyZCgpO1xuICAgIGNvbnN0IGRpc3BsYXllZEJvYXJkID0gcGxheWVyT25lRGlzcGxheTtcblxuICAgIGNvbnN0IHNoaXAgPSBib2FyZE9iamVjdC5wbGFjZVNoaXAoc2hpcExlbmd0aCwgeCwgeSwgcG9zaXRpb24pO1xuICAgIGlmIChzaGlwICE9PSBmYWxzZSkge1xuICAgICAgcmVuZGVyR2FtZWJvYXJkKGJvYXJkLCBkaXNwbGF5ZWRCb2FyZCk7XG4gICAgICBzaGlwTGVuZ3RoICs9IDE7XG4gICAgfVxuICAgIGlmIChzaGlwTGVuZ3RoID4gNSkgY3JlYXRlU3RhcnRHYW1lUG9wdXAoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoYW5nZUdhbWVNb2RlKCkge1xuICAgIGNvbnN0IHBsYXllck9uZUdhbWVib2FyZCA9IGdhbWVDb250cm9sbGVyLmdldFBsYXllck9uZUdhbWVib2FyZCgpO1xuICAgIGNvbnN0IHBsYXllclR3b0dhbWVib2FyZCA9IGdhbWVDb250cm9sbGVyLmdldFBsYXllclR3b0dhbWVib2FyZCgpO1xuICAgIGlmIChzaGlwTGVuZ3RoID4gNSkgZ2FtZU1vZGUgPSBcImdhbWVcIjtcbiAgICBpZiAoc2hpcExlbmd0aCA8IDUpIGdhbWVNb2RlID0gXCJpbml0XCI7XG4gICAgcmVuZGVyR2FtZWJvYXJkcyhcbiAgICAgIHBsYXllck9uZUdhbWVib2FyZC5nZXRCb2FyZCgpLFxuICAgICAgcGxheWVyVHdvR2FtZWJvYXJkLmdldEJvYXJkKCksXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN3aXRjaFBvc2l0aW9uKCkge1xuICAgIHN3aXRjaCAocG9zaXRpb24pIHtcbiAgICAgIGNhc2UgXCJ2ZXJ0aWNhbFwiOlxuICAgICAgICBwb3NpdGlvbiA9IFwiaG9yaXpvbnRhbFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJob3Jpem9udGFsXCI6XG4gICAgICAgIHBvc2l0aW9uID0gXCJ2ZXJ0aWNhbFwiO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBzd2l0Y2hQb3NpdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3dpdGNoUG9zaXRpb24pO1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVyR2FtZWJvYXJkcyxcbiAgICBjcmVhdGVFbmRHYW1lUG9wdXAsXG4gICAgcmVtb3ZlRmllbGRzRXZlbnRMaXN0ZW5lcnMsXG4gICAgcGxheWVyT25lRGlzcGxheSxcbiAgICBwbGF5ZXJUd29EaXNwbGF5LFxuICB9O1xufVxuIiwiaW1wb3J0IHsgZ2FtZWJvYXJkRmFjdG9yeSB9IGZyb20gXCIuL2dhbWVib2FyZC5qc1wiO1xuaW1wb3J0IHsgcGxheWVyIH0gZnJvbSBcIi4vcGxheWVyLmpzXCI7XG5pbXBvcnQgeyBkb21Db250cm9sbGVyIH0gZnJvbSBcIi4vZG9tLmpzXCI7XG5cbmxldCBwbGF5ZXJPbmVHYW1lYm9hcmQgXG5sZXQgcGxheWVyVHdvR2FtZWJvYXJkIFxuY29uc3QgZ2V0UGxheWVyT25lR2FtZWJvYXJkID0gKCkgPT4gcGxheWVyT25lR2FtZWJvYXJkXG5jb25zdCBnZXRQbGF5ZXJUd29HYW1lYm9hcmQgPSAoKSA9PiBwbGF5ZXJUd29HYW1lYm9hcmRcbmNvbnN0IHBsYXllck9uZSA9IHBsYXllcihmYWxzZSwgdHJ1ZSk7XG5jb25zdCBwbGF5ZXJUd28gPSBwbGF5ZXIodHJ1ZSwgZmFsc2UpO1xuY29uc3QgZG9tID0gZG9tQ29udHJvbGxlcihcbiAgcGxheWVyT25lLFxuICBwbGF5ZXJUd28sXG4pO1xuZXhwb3J0IGZ1bmN0aW9uIGdhbWUoKSB7XG4gIGZ1bmN0aW9uIGluaXRHYW1lYm9hcmRzKCkge1xuICAgIGNvbnN0IHBsYXllck9uZURpc3BsYXkgPSBkb20ucGxheWVyT25lRGlzcGxheVxuICAgIGNvbnN0IHBsYXllclR3b0Rpc3BsYXkgPSBkb20ucGxheWVyVHdvRGlzcGxheVxuICAgIHBsYXllck9uZUdhbWVib2FyZCA9IGdhbWVib2FyZEZhY3RvcnkoKTtcbiAgICBwbGF5ZXJUd29HYW1lYm9hcmQgPSBnYW1lYm9hcmRGYWN0b3J5KCk7XG4gICAgcGxheWVyT25lR2FtZWJvYXJkLmluaXRHYW1lYm9hcmQoKTtcbiAgICBwbGF5ZXJUd29HYW1lYm9hcmQuaW5pdEdhbWVib2FyZCgpO1xuICAgIHBsYXllck9uZURpc3BsYXkuYm9hcmQgPSBwbGF5ZXJPbmVHYW1lYm9hcmQuZ2V0Qm9hcmQoKVxuICAgIHBsYXllclR3b0Rpc3BsYXkuYm9hcmQgPSBwbGF5ZXJUd29HYW1lYm9hcmQuZ2V0Qm9hcmQoKVxuICAgIGRvbS5yZW5kZXJHYW1lYm9hcmRzKHBsYXllck9uZUdhbWVib2FyZC5nZXRCb2FyZCgpLCBwbGF5ZXJUd29HYW1lYm9hcmQuZ2V0Qm9hcmQoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgcGxheWVyT25lLnNldFBsYXllcnNUdXJuKHRydWUpO1xuICAgIHBsYXllclR3by5zZXRQbGF5ZXJzVHVybihmYWxzZSk7XG5cbiAgICBwbGF5ZXJUd29HYW1lYm9hcmQucGxhY2VTaGlwc1JhbmRvbWx5KDUpO1xuICAgIGRvbS5yZW5kZXJHYW1lYm9hcmRzKHBsYXllck9uZUdhbWVib2FyZC5nZXRCb2FyZCgpLCBwbGF5ZXJUd29HYW1lYm9hcmQuZ2V0Qm9hcmQoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5KHgsIHkpIHtcbiAgICBjb25zdCBwbGF5ZXJPbmVUdXJuID0gcGxheWVyT25lLmdldFBsYXllcnNUdXJuKCk7XG4gICAgY29uc3QgcGxheWVyVHdvVHVybiA9IHBsYXllclR3by5nZXRQbGF5ZXJzVHVybigpO1xuXG4gICAgaWYgKHBsYXllck9uZVR1cm4gPT09IHRydWUpIHtcbiAgICAgIHBsYXllck9uZS5hdHRhY2socGxheWVyVHdvR2FtZWJvYXJkLCBwbGF5ZXJUd28sIHgsIHkpO1xuICAgIH0gZWxzZSBpZiAocGxheWVyVHdvVHVybiA9PT0gdHJ1ZSkge1xuICAgICAgcGxheWVyVHdvLmF0dGFjayhwbGF5ZXJPbmVHYW1lYm9hcmQsIHBsYXllck9uZSk7XG4gICAgfVxuXG4gICAgaWYgKGlzR2FtZUZpbmlzaGVkKCkpIHtcbiAgICAgIGxldCB3aW5uZXIgPSBcIlwiO1xuICAgICAgaWYgKHBsYXllck9uZUdhbWVib2FyZC5hcmVBbGxTaGlwc1N1bmsoKSA9PT0gdHJ1ZSkge1xuICAgICAgICB3aW5uZXIgPSBcIlBsYXllciBUd29cIjtcbiAgICAgIH1cbiAgICAgIGlmIChwbGF5ZXJUd29HYW1lYm9hcmQuYXJlQWxsU2hpcHNTdW5rKCkgPT09IHRydWUpIHtcbiAgICAgICAgd2lubmVyID0gXCJQbGF5ZXIgT25lXCI7XG4gICAgICB9XG4gICAgICBlbmRHYW1lKHdpbm5lcik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNHYW1lRmluaXNoZWQoKSB7XG4gICAgaWYgKFxuICAgICAgcGxheWVyT25lR2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpID09PSB0cnVlIHx8XG4gICAgICBwbGF5ZXJUd29HYW1lYm9hcmQuYXJlQWxsU2hpcHNTdW5rKCkgPT09IHRydWVcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBlbmRHYW1lKHdpbm5lcikge1xuICAgIGRvbS5jcmVhdGVFbmRHYW1lUG9wdXAod2lubmVyKTtcbiAgICBkb20ucmVtb3ZlRmllbGRzRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnRHYW1lLFxuICAgIHBsYXksXG4gICAgZW5kR2FtZSxcbiAgICBpc0dhbWVGaW5pc2hlZCxcbiAgICBpbml0R2FtZWJvYXJkcyxcbiAgICBnZXRQbGF5ZXJPbmVHYW1lYm9hcmQsXG4gICAgZ2V0UGxheWVyVHdvR2FtZWJvYXJkXG4gIH07XG59XG5cbmV4cG9ydCB7IHBsYXllck9uZSwgcGxheWVyVHdvIH07XG4iLCJpbXBvcnQgeyBzaGlwRmFjdG9yeSB9IGZyb20gXCIuL3NoaXAuanNcIjtcblxuZXhwb3J0IGNvbnN0IGdhbWVib2FyZEZhY3RvcnkgPSAoKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gW107XG5cbiAgY29uc3QgZ2V0Qm9hcmQgPSAoKSA9PiBib2FyZDtcblxuICBmdW5jdGlvbiBjcmVhdGVGaWVsZCh4LCB5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uOiBbeCwgeV0sXG4gICAgICBvY2N1cGllZEJ5U2hpcDogZmFsc2UsXG4gICAgICBoaXQ6IGZhbHNlLFxuICAgICAgc2hpcDogbnVsbCxcbiAgICAgIGJvYXJkOiBnZXRCb2FyZCgpLFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbml0R2FtZWJvYXJkKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgYXJyLnB1c2goY3JlYXRlRmllbGQoaSwgaikpO1xuICAgICAgfVxuICAgICAgYm9hcmQucHVzaChhcnIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHByaW50Qm9hcmQoKSB7XG4gICAgYm9hcmQuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICBsZXQgc3RyaW5nID0gXCJcIjtcbiAgICAgIHJvdy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICBpZiAoIWZpZWxkLm9jY3VwaWVkQnlTaGlwICYmICFmaWVsZC5oaXQpIHtcbiAgICAgICAgICBzdHJpbmcgKz0gYHwgJHtmaWVsZC5wb3NpdGlvbn0gfGA7XG4gICAgICAgIH0gZWxzZSBpZiAoIWZpZWxkLm9jY3VwaWVkQnlTaGlwICYmIGZpZWxkLmhpdCkge1xuICAgICAgICAgIHN0cmluZyArPSBgfCAgLSAgfGA7XG4gICAgICAgIH0gZWxzZSBpZiAoZmllbGQub2NjdXBpZWRCeVNoaXAgJiYgIWZpZWxkLmhpdCkge1xuICAgICAgICAgIHN0cmluZyArPSBcInwgIE8gIHxcIjtcbiAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5vY2N1cGllZEJ5U2hpcCAmJiBmaWVsZC5oaXQpIHtcbiAgICAgICAgICBzdHJpbmcgKz0gXCJ8ICBYICB8XCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coc3RyaW5nKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmROZWlnaGJvdXJGaWVsZHModGFyZ2V0RmllbGRzKSB7XG4gICAgaWYgKCF0YXJnZXRGaWVsZHMpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBib2FyZCA9IGdldEJvYXJkKCk7XG4gICAgbGV0IGR1cGxpY2F0ZWROZWlnaGJvdXJzID0gW107XG4gICAgY29uc3QgbmVpZ2hib3VycyA9IFtdO1xuICAgIGNvbnN0IHBvc3NiaWxlTmVpZ2hib3VycyA9IFtdO1xuXG4gICAgdGFyZ2V0RmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICBjb25zdCB4ID0gZmllbGQucG9zaXRpb25bMF07XG4gICAgICBjb25zdCB5ID0gZmllbGQucG9zaXRpb25bMV07XG5cbiAgICAgIC8vIGFsbCB0aGUgcG9zc2libGUgbmVpZ2hib3VyIGZpZWxkc1xuICAgICAgY29uc3QgcG9zc2libGVOZWlnaGJvdXJzQ29vcmRpbmF0ZXMgPSBbXG4gICAgICAgIFt4IC0gMSwgeSAtIDFdLFxuICAgICAgICBbeCAtIDEsIHldLFxuICAgICAgICBbeCAtIDEsIHkgKyAxXSxcbiAgICAgICAgW3gsIHkgKyAxXSxcbiAgICAgICAgW3ggKyAxLCB5ICsgMV0sXG4gICAgICAgIFt4ICsgMSwgeV0sXG4gICAgICAgIFt4ICsgMSwgeSAtIDFdLFxuICAgICAgICBbeCwgeSAtIDFdLFxuICAgICAgXTtcblxuICAgICAgLy8gcHVzaCB0aGUgbmVpZ2hib3VyIGZpZWxkcyB0aGF0IGFyZSBub3Qgb3V0IG9mIGJvdW5kc1xuICAgICAgcG9zc2libGVOZWlnaGJvdXJzQ29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSkgPT4ge1xuICAgICAgICBpZiAoaXNPdXRPZkJvdW5kKGNvb3JkaW5hdGVbMF0sIGNvb3JkaW5hdGVbMV0pID09PSBmYWxzZSlcbiAgICAgICAgICBwb3NzYmlsZU5laWdoYm91cnMucHVzaChib2FyZFtjb29yZGluYXRlWzBdXVtjb29yZGluYXRlWzFdXSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBvbmx5IG5laWdoYm91cnMgdGhhdCBhcmUgbm90IGluY2x1ZGVkIGluIHRoZSB0YXJnZXQgZmllbGRzIGFycmF5XG5cbiAgICBkdXBsaWNhdGVkTmVpZ2hib3VycyA9IHBvc3NiaWxlTmVpZ2hib3Vycy5maWx0ZXIoXG4gICAgICAobmVpZ2hib3VyKSA9PiB0YXJnZXRGaWVsZHMuaW5jbHVkZXMobmVpZ2hib3VyKSA9PT0gZmFsc2UsXG4gICAgKTtcblxuICAgIGR1cGxpY2F0ZWROZWlnaGJvdXJzLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICBpZiAoIW5laWdoYm91cnMuaW5jbHVkZXMoZmllbGQpKSBuZWlnaGJvdXJzLnB1c2goZmllbGQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5laWdoYm91cnM7XG4gIH1cblxuICBmdW5jdGlvbiBmaW5kVGFyZ2V0RmllbGRzKHNoaXBMZW5ndGgsIHgsIHksIGRpcmVjdGlvbiwgYm9hcmQpIHtcbiAgICBjb25zdCB0YXJnZXRGaWVsZHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgICAgaWYgKGlzT3V0T2ZCb3VuZCh4LCB5ICsgaSkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIm91dCBvZiBib3VuZHNcIik7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldEZpZWxkcy5wdXNoKGJvYXJkW3hdW3kgKyBpXSk7XG4gICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICAgIGlmIChpc091dE9mQm91bmQoeCArIGksIHkpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJvdXQgb2YgYm91bmRzXCIpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXRGaWVsZHMucHVzaChib2FyZFt4ICsgaV1beV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0RmllbGRzO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPdXRPZkJvdW5kKHgsIHkpIHtcbiAgICBpZiAoeCA8IDAgfHwgeCA+IDkgfHwgeSA8IDAgfHwgeSA+IDkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSWZGaWVsZE9jY3VwaWVkKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkLm9jY3VwaWVkQnlTaGlwID09PSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuU2hpcEJlUGxhY2VkKHRhcmdldEZpZWxkcywgbmVpZ2hib3VyRmllbGRzKSB7XG4gICAgY29uc29sZS5sb2codGFyZ2V0RmllbGRzLCBcInRhcmdldCBmaWVsZHNcIik7XG4gICAgaWYgKCF0YXJnZXRGaWVsZHMpIHJldHVybiBmYWxzZTtcblxuICAgIC8vIGlmIGZpZWxkcyBhcmUgYWxyZWFkeSBvY2N1cGllZCwgb3IgbmVpZ2hib3VyIGZpZWxkcyBhcmUgb2NjdXBpZWQsIHJldHVybiBmYWxzZVxuICAgIGlmIChcbiAgICAgIHRhcmdldEZpZWxkcy5zb21lKGNoZWNrSWZGaWVsZE9jY3VwaWVkKSB8fFxuICAgICAgbmVpZ2hib3VyRmllbGRzLnNvbWUoY2hlY2tJZkZpZWxkT2NjdXBpZWQpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcExlbmd0aCwgeCwgeSwgZGlyZWN0aW9uID0gXCJob3Jpem9udGFsXCIpIHtcbiAgICBjb25zdCBib2FyZCA9IGdldEJvYXJkKCk7XG4gICAgY29uc3QgdGFyZ2V0RmllbGRzID0gZmluZFRhcmdldEZpZWxkcyhzaGlwTGVuZ3RoLCB4LCB5LCBkaXJlY3Rpb24sIGJvYXJkKTtcbiAgICBjb25zdCBuZWlnaGJvdXJGaWVsZHMgPSBmaW5kTmVpZ2hib3VyRmllbGRzKHRhcmdldEZpZWxkcyk7XG4gICAgaWYgKCFjYW5TaGlwQmVQbGFjZWQodGFyZ2V0RmllbGRzLCBuZWlnaGJvdXJGaWVsZHMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHNoaXAgPSBzaGlwRmFjdG9yeShzaGlwTGVuZ3RoKTtcblxuICAgIHRhcmdldEZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgZmllbGQub2NjdXBpZWRCeVNoaXAgPSB0cnVlO1xuICAgICAgZmllbGQuc2hpcCA9IHNoaXA7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNoaXA7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXBzUmFuZG9tbHkoYW1vdW50KSB7XG4gICAgY29uc3QgcGxhY2VkU2hpcHMgPSBbXTtcbiAgICBsZXQgY3VycmVudFNoaXBMZW5naHQgPSAxO1xuICAgIHdoaWxlIChwbGFjZWRTaGlwcy5sZW5ndGggIT09IGFtb3VudCkge1xuICAgICAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICBjb25zdCByYW5kb21EaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIGxldCBkaXJlY3Rpb247XG5cbiAgICAgIHN3aXRjaCAocmFuZG9tRGlyZWN0aW9uKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBkaXJlY3Rpb24gPSBcInZlcnRpY2FsXCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBkaXJlY3Rpb24gPSBcImhvcml6b250YWxcIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hpcCA9IHBsYWNlU2hpcChjdXJyZW50U2hpcExlbmdodCwgeCwgeSwgZGlyZWN0aW9uKTtcblxuICAgICAgaWYgKHNoaXAgIT09IGZhbHNlKSB7XG4gICAgICAgIHBsYWNlZFNoaXBzLnB1c2goc2hpcCk7XG4gICAgICAgIGN1cnJlbnRTaGlwTGVuZ2h0Kys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayh4LCB5KSB7XG4gICAgaWYgKGlzT3V0T2ZCb3VuZCh4LCB5KSkge1xuICAgICAgY29uc29sZS5sb2coXCJvdXQgb2YgYm91bmRzXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChib2FyZFt4XVt5XS5oaXQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZmllbGQgYWxyZWFkeSBoaXRcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGJvYXJkW3hdW3ldLnNoaXAgIT09IG51bGwpIGJvYXJkW3hdW3ldLnNoaXAuaGl0KCk7XG5cbiAgICBib2FyZFt4XVt5XS5oaXQgPSB0cnVlO1xuICAgIC8vIHByaW50Qm9hcmQoKTtcbiAgICByZXR1cm4gYm9hcmRbeF1beV1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFyZUFsbFNoaXBzU3VuaygpIHtcbiAgICBjb25zdCBmaWVsZHNPY2N1cGllZEJ5U2hpcHMgPSBbXTtcbiAgICBib2FyZC5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgIGNvbnN0IG9jY3VwaWVkID0gcm93LmZpbHRlcigoZmllbGQpID0+IHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLm9jY3VwaWVkQnlTaGlwID09PSB0cnVlO1xuICAgICAgfSk7XG4gICAgICBmaWVsZHNPY2N1cGllZEJ5U2hpcHMucHVzaCguLi5vY2N1cGllZCk7XG4gICAgfSk7XG4gICAgaWYgKGZpZWxkc09jY3VwaWVkQnlTaGlwcy5ldmVyeSgoZmllbGQpID0+IGZpZWxkLmhpdCA9PT0gdHJ1ZSkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlRmllbGQsXG4gICAgaW5pdEdhbWVib2FyZCxcbiAgICBwcmludEJvYXJkLFxuICAgIGdldEJvYXJkLFxuICAgIGZpbmRUYXJnZXRGaWVsZHMsXG4gICAgZmluZE5laWdoYm91ckZpZWxkcyxcbiAgICBjYW5TaGlwQmVQbGFjZWQsXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgYXJlQWxsU2hpcHNTdW5rLFxuICAgIHBsYWNlU2hpcHNSYW5kb21seSxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBhaUF0dGFjayB9IGZyb20gXCIuL2FpLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBwbGF5ZXIgPSAoYWksIGlzSXRQbGF5ZXJzVHVybikgPT4ge1xuICBjb25zdCBpc0FpID0gYWk7XG4gIGxldCBwbGF5ZXJzVHVybiA9IGlzSXRQbGF5ZXJzVHVybjtcbiAgY29uc3QgZ2V0UGxheWVyc1R1cm4gPSAoKSA9PiBwbGF5ZXJzVHVybjtcbiAgY29uc3Qgc2V0UGxheWVyc1R1cm4gPSAodmFsdWUpID0+IHtcbiAgICBwbGF5ZXJzVHVybiA9IHZhbHVlXG4gIH1cblxuICBmdW5jdGlvbiBjaGFuZ2VQbGF5ZXJzVHVybihzZWNvbmRQbGF5ZXIpIHtcbiAgICBjb25zdCBzZWNvbmRQbGF5ZXJUdXJuID0gc2Vjb25kUGxheWVyLmdldFBsYXllcnNUdXJuKCk7XG4gICAgc3dpdGNoIChwbGF5ZXJzVHVybikge1xuICAgICAgY2FzZSB0cnVlOlxuICAgICAgICBwbGF5ZXJzVHVybiA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgIHBsYXllcnNUdXJuID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHN3aXRjaCAoc2Vjb25kUGxheWVyVHVybikge1xuICAgICAgY2FzZSB0cnVlOlxuICAgICAgICBzZWNvbmRQbGF5ZXIuc2V0UGxheWVyc1R1cm4oZmFsc2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgIHNlY29uZFBsYXllci5zZXRQbGF5ZXJzVHVybih0cnVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICB9XG5cbiAgZnVuY3Rpb24gYXR0YWNrKGJvYXJkLCBhdHRhY2tlZFBsYXllciwgeCwgeSkge1xuICAgIGNoYW5nZVBsYXllcnNUdXJuKGF0dGFja2VkUGxheWVyKTtcbiAgICBpZiAoaXNBaSkge1xuICAgICAgY29uc29sZS5sb2coXCJwbGF5ZXIgb25lIHR1cm5cIiwgcGxheWVyc1R1cm4pO1xuICAgICAgY29uc29sZS5sb2coXCJwbGF5ZXIgdHdvIHR1cm5cIiwgYXR0YWNrZWRQbGF5ZXIuZ2V0UGxheWVyc1R1cm4oKSk7XG4gICAgICBhaUF0dGFjayhib2FyZCwgYXR0YWNrZWRQbGF5ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcInBsYXllciBvbmUgdHVyblwiLCBwbGF5ZXJzVHVybik7XG4gICAgICBjb25zb2xlLmxvZyhcInBsYXllciB0d28gdHVyblwiLCBhdHRhY2tlZFBsYXllci5nZXRQbGF5ZXJzVHVybigpKTtcbiAgICAgIHJldHVybiBib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmRSYW5kb21Nb3ZlKCkge1xuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcblxuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBmdW5jdGlvbiBpc01vdmVMZWdhbCh4LCB5LCBib2FyZCkge1xuICAgIGlmIChib2FyZFt4XVt5XS5oaXQgPT09IHRydWUpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGZ1bmN0aW9uIGFpQXR0YWNrKGJvYXJkKSB7XG4gIC8vICAgbGV0IHJhbmRvbU1vdmUgPSBmaW5kUmFuZG9tTW92ZSgpO1xuICAvLyAgIHdoaWxlIChcbiAgLy8gICAgIGlzTW92ZUxlZ2FsKHJhbmRvbU1vdmVbMF0sIHJhbmRvbU1vdmVbMV0sIGJvYXJkLmdldEJvYXJkKCkpID09PSBmYWxzZVxuICAvLyAgICkge1xuICAvLyAgICAgcmFuZG9tTW92ZSA9IGZpbmRSYW5kb21Nb3ZlKCk7XG4gIC8vICAgfVxuICAvLyAgIGNvbnNvbGUubG9nKC4uLnJhbmRvbU1vdmUpXG4gIC8vICAgcmV0dXJuIGJvYXJkLnJlY2VpdmVBdHRhY2soLi4ucmFuZG9tTW92ZSk7XG4gIC8vIH1cblxuICByZXR1cm4ge1xuICAgIGF0dGFjayxcbiAgICBnZXRQbGF5ZXJzVHVybixcbiAgICBzZXRQbGF5ZXJzVHVybixcbiAgICBpc01vdmVMZWdhbCxcbiAgICBjaGFuZ2VQbGF5ZXJzVHVybixcbiAgICBmaW5kUmFuZG9tTW92ZVxuICB9O1xufTtcbiIsImNvbnN0IHNoaXBGYWN0b3J5ID0gKGxlbmd0aCkgPT4ge1xuICBcbiAgbGV0IG51bWJlck9mSGl0cyA9IDA7XG5cbiAgY29uc3QgZ2V0TGVuZ3RoID0gKCkgPT4gbGVuZ3RoO1xuICBjb25zdCBnZXROdW1iZXJPZkhpdHMgPSAoKSA9PiBudW1iZXJPZkhpdHNcblxuICBjb25zdCBoaXQgPSAoKSA9PiB7XG4gICAgbnVtYmVyT2ZIaXRzICs9IDFcbiAgICByZXR1cm4gbnVtYmVyT2ZIaXRzXG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIGlmIChudW1iZXJPZkhpdHMgPT09IGxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ2V0TGVuZ3RoLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gICAgZ2V0TnVtYmVyT2ZIaXRzXG4gIH07XG59O1xuXG5jb25zdCBzaGlwID0gc2hpcEZhY3RvcnkoMSk7XG5zaGlwLmhpdCgpO1xuXG5jb25zb2xlLmxvZyhzaGlwLmdldExlbmd0aCgpKTtcbmV4cG9ydCB7IHNoaXBGYWN0b3J5IH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lLmpzXCI7XG5pbXBvcnQgeyBmaW5kQWRqYWNlbnRGaWVsZE9uQXhpcyB9IGZyb20gXCIuL2FpLmpzXCI7XG5cblxuY29uc3QgZ2FtZUNvbnRyb2xsZXIgPSBnYW1lKClcblxuXG5nYW1lQ29udHJvbGxlci5pbml0R2FtZWJvYXJkcygpXG5jb25zdCBib2FyZE9iamVjdCA9IGdhbWVDb250cm9sbGVyLmdldFBsYXllck9uZUdhbWVib2FyZCgpXG5jb25zdCBwbGF5ZXJPbmVCb2FyZCA9IGdhbWVDb250cm9sbGVyLmdldFBsYXllck9uZUdhbWVib2FyZCgpLmdldEJvYXJkKClcbmNvbnNvbGUubG9nKGJvYXJkT2JqZWN0LmdldEJvYXJkKCkpXG4vLyBjb25zb2xlLmxvZyhwbGF5ZXJPbmVCb2FyZClcbmJvYXJkT2JqZWN0LnByaW50Qm9hcmQoKVxuY29uc29sZS5sb2coZmluZEFkamFjZW50RmllbGRPbkF4aXMocGxheWVyT25lQm9hcmRbNl1bN10sIHBsYXllck9uZUJvYXJkWzVdWzddLCBib2FyZE9iamVjdCkpXG5cblxud2luZG93LnN0YXJ0R2FtZSA9IGdhbWVDb250cm9sbGVyLnN0YXJ0R2FtZVxud2luZG93LmVuZEdhbWUgPSBnYW1lQ29udHJvbGxlci5lbmRHYW1lXG4vLyBnYW1lQ29udHJvbGxlci5zdGFydEdhbWUoKVxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=