import { gameboardFactory } from "./gameboard.js";
import { player } from "./player.js";
import { domController } from "./dom.js";

const dom = domController()

export function startGame() {
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

  dom.initGameboardDisplay(playerOneGameboard, playerTwoGameboard)

  return {
    play,
  };
}
