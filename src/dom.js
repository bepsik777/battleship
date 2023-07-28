import {
  game,
  playerOneGameboard,
  playerTwoGameboard,
  playerOne,
} from "./game.js";

export function domController() {
  const main = document.querySelector("main");
  const playerOneDisplay = document.querySelector(".player-one-board");
  const playerTwoDisplay = document.querySelector(".player-two-board");
  const boards = [playerOneGameboard.getBoard(), playerTwoGameboard.getBoard()];
  const fields = [];
  const gameController = game();
  playerOneDisplay.board = boards[0];
  playerTwoDisplay.board = boards[1];

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

    // Add event listeners to each field
    renderedField.addEventListener("click", playOnClick);

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
    text.textContent = `${winner} Won`

    const newGameButton = document.createElement('button')
    newGameButton.classList.add('new-game')
    newGameButton.textContent = 'New Game'

    main.appendChild(modal)
    modal.appendChild(text)
    modal.appendChild(newGameButton)


    console.log(fields);
  }

  function removeFieldsEventListeners() {
    const displayedFields = document.querySelectorAll(".field");

    displayedFields.forEach((field) => {
      field.removeEventListener("click", playOnClick);
    });
  }

  return {
    renderGameboards,
    createEndGamePopup,
    removeFieldsEventListeners,
  };
}
