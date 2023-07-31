export const player = (ai, isItPlayersTurn) => {
  const isAi = ai;
  let playersTurn = isItPlayersTurn;
  const getPlayersTurn = () => playersTurn;
  const setPlayersTurn = (value) => {
    playersTurn = value
  }

  function changePlayersTurn(secondPlayer) {
    const secondPlayerTurn = secondPlayer.getPlayersTurn();
    switch (playersTurn) {
      case true:
        playersTurn = false;
        break;
      case false:
        playersTurn = true;
        break;
    }
    switch (secondPlayerTurn) {
      case true:
        secondPlayer.setPlayersTurn(false);
        break;
      case false:
        secondPlayer.setPlayersTurn(true);
        break;
    }
    
  }

  function attack(board, attackedPlayer, x, y) {
    changePlayersTurn(attackedPlayer);
    if (isAi) {
      console.log("player one turn", playersTurn);
      console.log("player two turn", attackedPlayer.getPlayersTurn());
      aiAttack(board, attackedPlayer);
    } else {
      console.log("player one turn", playersTurn);
      console.log("player two turn", attackedPlayer.getPlayersTurn());
      return board.receiveAttack(x, y);
    }
  }

  function findRandomMove() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    return [x, y];
  }

  function isMoveLegal(x, y, board) {
    if (board[x][y].hit === true) return false;
    return true;
  }

  function aiAttack(board) {
    let randomMove = findRandomMove();
    while (
      isMoveLegal(randomMove[0], randomMove[1], board.getBoard()) === false
    ) {
      randomMove = findRandomMove();
    }
    console.log(...randomMove)
    return board.receiveAttack(...randomMove);
  }

  return {
    attack,
    getPlayersTurn,
    setPlayersTurn,
    isMoveLegal,
    changePlayersTurn,
    findRandomMove
  };
};
