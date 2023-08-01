import { game, playerOne } from "./game.js";
import { gameboardFactory } from "./gameboard.js";

export function domController() {
  const gameboardController = gameboardFactory();
  const gameController = game();
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
    if (playerOne.getPlayersTurn() !== true) return;
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
