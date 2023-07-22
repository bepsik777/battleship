import { gameboardFactory } from "./gameboard.js";
import { player } from "./player.js";

export function startGame() {
  const gameEnded = false;
  const playerOneGameboard = gameboardFactory();
  const playerTwoGameboard = gameboardFactory();
  const playerOne = player(false, true);
  const playerTwo = player(true, false);

  playerOneGameboard.initGameboard();
  playerTwoGameboard.initGameboard();

  playerOneGameboard.placeShipsRandomly();
  playerTwoGameboard.placeShipsRandomly();

  playerOneGameboard.printBoard();
  console.log("--------------------------------------------------------");
  playerTwoGameboard.printBoard();

  function play() {
    const playerOneTurn = playerOne.getPlayersTurn();
    const playerTwoTurn = playerTwo.getPlayersTurn();

    if (playerOneTurn === true) {
      const x = prompt("x");
      const y = prompt("y");

      playerOne.attack(playerTwoGameboard, playerTwo, x, y);
    } else if (playerTwoTurn === true) {
      playerTwo.attack(playerOneGameboard, playerOne);
    }
    if (
      playerOneGameboard.areAllShipsSunk() === true ||
      playerTwoGameboard.areAllShipsSunk() === true
    ) {
      console.log("game ended");
    }
    playerOneGameboard.printBoard();
    console.log("--------------------------------------------------------");
    playerTwoGameboard.printBoard();
  }

  return {
    play,
  };

  //   while (gameEnded === false) {
  //     const playerOneTurn = playerOne.getPlayersTurn();
  //     const playerTwoTurn = playerTwo.getPlayersTurn();

  //     if (playerOneTurn === true && playerTwoTurn === false) {
  //       let attackCoordinateX;
  //       let attackCoordinateY;
  //       while (
  //         playerTwo.isMoveLegal(
  //           attackCoordinateX,
  //           attackCoordinateY,
  //           playerTwoGameboard.getBoard(),
  //         ) === false
  //       ) {
  //         attackCoordinateX = prompt("choose coordinate on axis x");
  //         attackCoordinateY = prompt("choose coordinate on axis y");
  //       }
  //       playerOne.attack(
  //         playerTwoGameboard,
  //         playerTwo,
  //         attackCoordinateX,
  //         attackCoordinateY,
  //       );
  //     } else if (playerOneTurn === false && playerTwoTurn === true) {
  //       playerTwo.attack(playerOneGameboard, playerOne);
  //     }
  //   }
  //   if (
  //     playerOneGameboard.areAllShipsSunk() ||
  //     playerTwoGameboard.areAllShipsSunk()
  //   ) {
  //     gameEnded = true;
  //     console.log("game over");
  //   }
}
