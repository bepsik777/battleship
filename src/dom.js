export function domController(
  playerOneGameboard,
  playerTwoGameboard,
  playerOne,
  playerTwo,
) {
  const playerOneDisplay = document.querySelector(".player-one-board");
  const playerTwoDisplay = document.querySelector(".player-two-board");
  const boards = [playerOneGameboard.getBoard(), playerTwoGameboard.getBoard()];
  const fields = [];
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

    renderedField.addEventListener("click", playOnClick);
    boardDisplay.appendChild(renderedField);
    return renderedField;
  }

  function renderGameBoard(board, boardDisplay) {
    board.forEach((row) => {
      row.forEach((field) => {
        renderField(field, boardDisplay);
      });
    });
  }

  function renderGameboards() {
    playerTwoDisplay.innerHTML = "";
    playerOneDisplay.innerHTML = "";
    renderGameBoard(boards[0], playerOneDisplay);
    renderGameBoard(boards[1], playerTwoDisplay);
    console.log(fields);
  }

  function playOnClick(e) {
    // If clicked field is not on enemy board or it is not human player turn: return
    if (e.target.parentElement !== playerTwoDisplay) return;
    if (playerOne.getPlayersTurn() !== true) return;
    const x = e.target.field.position[0];
    const y = e.target.field.position[1];
    playerOne.attack(playerTwoGameboard, playerTwo, x, y);
    console.log(e.target.field);
    // re-render both gameBoards
    renderGameboards();
    setTimeout(() => {
        aiAttack()
    }, "1000")
  }

  function aiAttack() {
    playerTwo.attack(playerOneGameboard, playerOne)
    renderGameboards()
  }

  return {
    renderGameboards,
  };
}

//   function initGameboardDisplay() {
//     console.log(playerOneDisplay, playerTwoDisplay);

//     boards.forEach((board) => {
//       board.forEach((row) => {
//         row.forEach((field) => {
//           const fieldDisplay = document.createElement("div");
//           fieldDisplay.classList.add("field");
//           if (field.occupiedByShip === true) {
//             fieldDisplay.classList.add("ship");
//           }
//           fieldDisplay.textContent = field.position.toString();
//           fieldDisplay.position = field.position;

//           if (board === playerOneGameboard.getBoard()) {
//             field.board = playerOneGameboard.getBoard();
//             playerOneDisplay.appendChild(fieldDisplay);
//           } else if (board === playerTwoGameboard.getBoard()) {
//             field.board = playerTwoGameboard.getBoard();
//             playerTwoDisplay.appendChild(fieldDisplay);
//           }
//           fields.push(fieldDisplay);
//         });
//       });
//     });

//     fields.forEach((field) => {
//       field.addEventListener("click", (e) => {
//         console.log(e.currentTarget.position);
//       });
//     });
//   }

//   function attack(field, playerOne, playerTwo) {
//     if (playerOne.getPlayesTurn() === false) return;
//     if (field.board !== playerTwoGameboard) return;
//     playerOne.attack(field.board, playerTwo, field.position[0], field.position[1])
//     // when clicked, call the appropriate attack
//     playerTwo.attack(playerOneGameboard, playerOne)
//   }
