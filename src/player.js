export const player = () => {
    function attack(x, y, board) {
        return board.receiveAttack(x,y)
    }

    return {
        attack,
    }
}