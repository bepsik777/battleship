export function domController(
    playerOneGameboard,
    playerTwoGameboard
  ) {
    const playerOneDisplay = document.querySelector(".player-one-board");
    const playerTwoDisplay = document.querySelector(".player-two-board");
    const boards = [playerOneGameboard.getBoard(), playerTwoGameboard.getBoard()];
    const fields = [];
    playerOneDisplay.board = boards[0]
    playerTwoDisplay.board = boards[1]

  
    function renderField(field, boardDisplay) {
      const renderedField = document.createElement("div");
      renderedField.classList.add("field");
      if (field.ship !== null) {
        renderedField.classList.add("ship");
      } 
      if (field.hit === true) {
          renderField.classList.add('hit')
      }
      renderedField.board = field.board
      renderedField.field = field

      if (!fields.includes(field.postion)) {
        fields.push(field.position)
      }
  
      boardDisplay.appendChild(renderedField)
      return renderField
    }
  
    function renderGameBoard(board, boardDisplay) {
      board.forEach(row => {
          row.forEach(field => {
              const renderedField = renderField(field, boardDisplay)
          })
      })
    }

    function renderGameboards() {
        renderGameBoard(boards[0], playerOneDisplay)
        renderGameBoard(boards[1], playerTwoDisplay)
        console.log(fields)
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
  
    return {
      renderGameboards
    };
  }
  