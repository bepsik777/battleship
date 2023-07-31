import { gameboardFactory } from "./gameboard.js";
import { player } from "./player.js";
import { domController } from "./dom.js";

let playerOneGameboard 
let playerTwoGameboard 
const getPlayerOneGameboard = () => playerOneGameboard
const getPlayerTwoGameboard = () => playerTwoGameboard
const playerOne = player(false, true);
const playerTwo = player(true, false);
const dom = domController(
  playerOne,
  playerTwo,
);
export function game() {
  function initGameboards() {
    const playerOneDisplay = dom.playerOneDisplay
    const playerTwoDisplay = dom.playerTwoDisplay
    playerOneGameboard = gameboardFactory();
    playerTwoGameboard = gameboardFactory();
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

export { playerOne, playerTwo };
