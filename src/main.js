import { game } from "./game.js";



const gameController = game()


gameController.initGameboards()
console.log(gameController.getPlayerOneGameboard().getBoard())
window.startGame = gameController.startGame
window.endGame = gameController.endGame
// gameController.startGame()

