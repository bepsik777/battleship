export function domController() {
  const playerOneDisplay = document.querySelector(".player-one-board");
  const playerTwoDisplay = document.querySelector(".player-two-board");
  const fields = [];

  function initGameboardDisplay(playerOneGameboard, playerTwoGameboard) {
    const boards = [
      playerOneGameboard.getBoard(),
      playerTwoGameboard.getBoard(),
    ];

    boards.forEach((board) => {
      board.forEach((row) => {
        row.forEach((field) => {
          const fieldDisplay = document.createElement("div");
          fieldDisplay.classList.add("field");
          if (field.occupiedByShip === true) {
            fieldDisplay.classList.add("ship");
          }
          fieldDisplay.textContent = field.position.toString();
          fieldDisplay.position = field.position;

          if (board === playerOneGameboard.getBoard()) {
            playerOneDisplay.appendChild(fieldDisplay);
          } else if (board === playerTwoGameboard.getBoard()) {
            playerTwoDisplay.appendChild(fieldDisplay);
          }
          fields.push(fieldDisplay);
        });
      });
    });

    fields.forEach((field) => {
      field.addEventListener("click", (e) => {
        console.log(e.currentTarget.position);
      });
    });
  }

  return {
    initGameboardDisplay,
  };
}
