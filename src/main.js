import { game } from "./game.js";
import { findAdjacentFieldOnAxis } from "./ai.js";


const gameController = game()


gameController.initGameboards()
const boardObject = gameController.getPlayerOneGameboard()
const playerOneBoard = gameController.getPlayerOneGameboard().getBoard()
console.log(boardObject.getBoard())
// console.log(playerOneBoard)
boardObject.printBoard()
console.log(findAdjacentFieldOnAxis(playerOneBoard[6][7], playerOneBoard[5][7], boardObject))


window.startGame = gameController.startGame
window.endGame = gameController.endGame
// gameController.startGame()

