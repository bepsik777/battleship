import { gameboardFactory } from "./gameboard.js";
import { player } from "./player.js";
import { domController } from "./dom.js";

let playerOneGameboard = gameboardFactory();
let playerTwoGameboard = gameboardFactory();
const playerOne = player(false, true);
const playerTwo = player(true, false);
const dom = domController(
  playerOneGameboard,
  playerTwoGameboard,
  playerOne,
  playerTwo,
);
export function game() {
  function startGame() {
    playerOneGameboard.initGameboard();
    playerTwoGameboard.initGameboard();

    playerOneGameboard.placeShipsRandomly(1);
    playerTwoGameboard.placeShipsRandomly(1);

    playerOneGameboard.printBoard();
    console.log("--------------------------------------------------------");
    playerTwoGameboard.printBoard();

    dom.renderGameboards();
  }

  function play(x, y) {
    const playerOneTurn = playerOne.getPlayersTurn();
    const playerTwoTurn = playerTwo.getPlayersTurn();

    if (playerOneTurn === true) {
      playerOne.attack(playerTwoGameboard, playerTwo, x, y);
      console.log("player one attacked");
    } else if (playerTwoTurn === true) {
      //   setTimeout(() => {
      console.log("player two attakced");
      playerTwo.attack(playerOneGameboard, playerOne);
      //   }, "2500");
    }
    playerOneGameboard.printBoard();
    console.log("--------------------------------------------------------");
    playerTwoGameboard.printBoard();
    if (isGameFinished()) {
      let winner = '';
      if (playerOneGameboard.areAllShipsSunk() === true) {
        winner = "Player Two";
      }
      if (playerTwoGameboard.areAllShipsSunk() === true) {
        winner = "Player One"
    };
      console.log("game finished");
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
    playerOneGameboard = gameboardFactory();
    playerTwoGameboard = gameboardFactory();
    // startGame();
  }

  return {
    startGame,
    play,
    isGameFinished,
  };
}

export { playerOneGameboard, playerTwoGameboard, playerOne, playerTwo };
