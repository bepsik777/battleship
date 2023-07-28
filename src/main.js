import { game } from "./game.js";
import { domController } from "./dom.js";



const gameController = game()
const dom = domController()


gameController.initGameboards()
window.startGame = gameController.startGame
// gameController.startGame()

