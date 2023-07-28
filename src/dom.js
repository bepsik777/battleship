import {
  game,
  playerOneGameboard,
  playerTwoGameboard,
  playerOne,
} from "./game.js";
import { gameboardFactory } from "./gameboard.js";

export function domController() {
  const gameboardController = gameboardFactory();
  const main = document.querySelector("main");
  const playerOneDisplay = document.querySelector(".player-one-board");
  const playerTwoDisplay = document.querySelector(".player-two-board");
  let boards = [playerOneGameboard.getBoard(), playerTwoGameboard.getBoard()];
  const fields = [];
  const gameController = game();
  let gameMode = "init";
  let shipLength = 1;
  let x;
  let y;
  const position = "vertical";
  playerOneDisplay.board = boards[0];
  playerTwoDisplay.board = boards[1];
  playerOneDisplay.boardObject = playerOneGameboard;
  playerTwoDisplay.boardObject = playerTwoGameboard;

  function renderField(field, boardDisplay) {
    const renderedField = document.createElement("div");
    renderedField.classList.add("field");
    if (field.ship !== null) {
      renderedField.classList.add("ship");
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

    // Add event listeners to each field
    // renderedField.addEventListener("click", playOnClick);
    // renderedField.addEventListener("mouseover", highlightTargetField);
    // renderedField.addEventListener("mouseout", unhighlightTargetFields);
    // renderedField.addEventListener("click", placeShip);

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

  function renderGameboards() {
    renderGameboard(boards[0], playerOneDisplay);
    renderGameboard(boards[1], playerTwoDisplay);
    console.log(boards, playerOneDisplay, playerTwoDisplay);
  }

  function playOnClick(e) {
    // If clicked field is not on enemy board or it is not human player turn: return
    if (e.target.parentElement !== playerTwoDisplay) return;
    if (playerOne.getPlayersTurn() !== true) return;
    if (e.target.field.hit === true) return;

    const x = e.target.field.position[0];
    const y = e.target.field.position[1];

    gameController.play(x, y);

    // This game ending condition is also present in game.js
    // console.log(gameController.isGameFinished())
    if (gameController.isGameFinished()) {
      renderGameboards();
      return;
    }
    renderGameboard(e.target.parentElement.board, e.target.parentElement);

    setTimeout(() => {
      gameController.play();
      renderGameboard(boards[0], playerOneDisplay);
    }, "1500");
  }

  function createEndGamePopup(winner) {
    const modal = document.createElement("div");
    modal.classList.add("endgame");
    modal.classList.add("modal");

    const text = document.createElement("p");
    text.classList.add("end-game-text");
    text.textContent = `${winner} Won`;

    const newGameButton = document.createElement("button");
    newGameButton.classList.add("new-game");
    newGameButton.textContent = "New Game";

    main.appendChild(modal);
    modal.appendChild(text);
    modal.appendChild(newGameButton);

    newGameButton.addEventListener("click", (e) => {
      resetDisplay();
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
    boards = [playerOneGameboard.getBoard(), playerTwoGameboard.getBoard()];
    playerOneDisplay.board = boards[0];
    playerTwoDisplay.board = boards[1];
    main.removeChild(modal);
    gameController.startGame();
  }

  // SHIP PLACING LOGIC

  // const boardObject = e.target.parentElement.boardObject;
  // const board = e.target.parentElement.board
  // const displayedBoard = e.target.parentElement;
  // let shipLength = 1;
  // let x;
  // let y;
  // const position = "vertical";

  function showTargetFields(e) {
    if (shipLength > 5) return;
    if (e.target.parentElement.boardObject !== playerOneGameboard) return;
    const renderedFields = Array.from(document.querySelectorAll(".field"));
    // const x = e.target.field.position[0];
    // const y = e.target.field.position[1];
    x = e.target.field.position[0];
    y = e.target.field.position[1];
    const board = e.target.parentElement.board;
    // shipLength = 3;
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
    // const x = e.target.field.position[0]
    // const y = e.target.field.position[1]
    if (shipLength > 5) return;
    const boardObject = e.target.parentElement.boardObject;
    const board = e.target.parentElement.board;
    const displayedBoard = e.target.parentElement;

    const ship = boardObject.placeShip(shipLength, x, y, position);
    if (ship !== false) {
      renderGameboard(board, displayedBoard);
      shipLength += 1;
      console.log(board);
      console.log(shipLength);
    }
  }

  function changeGameMode () {
    if (shipLength > 5) gameMode = 'game'
    if (shipLength < 5) gameMode = 'init'
    renderGameboards()
  }

  return {
    renderGameboards,
    createEndGamePopup,
    removeFieldsEventListeners,
  };
}
