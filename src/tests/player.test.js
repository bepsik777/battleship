import { player } from "../player.js";
import { gameboardFactory } from "../gameboard.js";

const gameboardObject = gameboardFactory()
const testPlayer = player()
gameboardObject.initGameboard()
const board = gameboardObject.getBoard()

describe('can attack', () => {

    test('attack in bounds', () => {
        testPlayer.attack(1,1,gameboardObject)
        expect(board[1][1].hit).toEqual(true)
    })

    test('attack out of bounds', () => {
        expect(testPlayer.attack(12,12,gameboardObject)).toEqual(false)
    })

    test('attack already attacked field', () => {
        testPlayer.attack(2,2,gameboardObject)
        expect(testPlayer.attack(2,2,gameboardObject)).toEqual(false)
    })
})