let hits = 0;
let hitedShip;
let hitedField;
let tempHitedField;

function isMoveLegal(x, y, board) {
  if (x > 9 || x < 0 || y < 0 || y > 9) return false;
  if (board[x][y].hit === true) return false;
  return true;
}
function findRandomMove() {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);

  return [x, y];
}

function findFourAdjacentFields(field, board) {
  const x = field.position[0];
  const y = field.position[1];
  const possibleFields = [
    [x, y + 1],
    [x, y - 1],
    [x + 1, y],
    [x - 1, y],
  ];
  const targetFields = possibleFields.filter((field) =>
    isMoveLegal(field[0], field[1], board.getBoard()),
  );
  return targetFields;
}

function findAdjacentFieldOnAxis(fieldOne, fieldTwo, board) {
  let a = fieldOne.position[0];
  let b = fieldOne.position[1];
  let x = fieldTwo.position[0];
  let y = fieldTwo.position[1];
  const possibleFields = [];
  let axis;
  

  if (a === x) {
    axis = "horizontal";
  } else if (b === y) {
    axis = "vertical";
  }
  console.log(axis)
  if (axis === "horizontal") {
    if (b > y) {
        a = fieldTwo.position[0]
        b = fieldTwo.position[1]
        x = fieldOne.position[0]
        y = fieldOne.position[1]
    }
    const targetFieldOne = [a, b - 1];
    const targetFieldTwo = [x, y + 1];
    possibleFields.push(targetFieldOne, targetFieldTwo);
  } else if (axis === "vertical") {
    if (a > x) {
        a = fieldTwo.position[0]
        b = fieldTwo.position[1]
        x = fieldOne.position[0]
        y = fieldOne.position[1]
        // console.log(a, b)
        // console.log(x, y)
    }
    const targetFieldOne = [a - 1, b];
    const targetFieldTwo = [x + 1, y];
    possibleFields.push(targetFieldOne, targetFieldTwo);
  }

  console.log(possibleFields, 'possible fields')
//   console.log(isMoveLegal(possibleFields[0][0], possibleFields[0][1], board.getBoard()))
//   console.log(isMoveLegal(possibleFields[1][0], possibleFields[1][1], board.getBoard()))
  const targetFields = possibleFields.filter((field) => {
    return isMoveLegal(field[0], field[1], board.getBoard());
  });
  console.log(targetFields, 'target fields')
  return targetFields;
}

// Na razie ai po 1 trafieniu uderza w jeden z czterech slotów w okół
function aiAttack(board) {
  if (hitedShip !== undefined && hitedShip.isSunk() === true) {
    hits = 0;
    hitedShip = undefined;
  }
  if (hits === 1) {
    const adjacentFields = findFourAdjacentFields(hitedField, board);
    const randomNum = Math.floor(Math.random() * adjacentFields.length);
    const randomMove = adjacentFields[randomNum];
    tempHitedField = board.receiveAttack(...randomMove);
    if (tempHitedField.ship !== null) {
      hits += 1;
    }

    console.log(hitedShip);
    return;
  }

  if (hits > 1) {
    console.log('hitedField', hitedField, 'temp hited field', tempHitedField)
    const targetFields = findAdjacentFieldOnAxis(
      hitedField,
      tempHitedField,
      board,
    );
    const randomNum = Math.floor(Math.random() * targetFields.length);
    const randomMove = targetFields[randomNum];
    const newHitedField = board.receiveAttack(...randomMove);
    if (newHitedField.ship !== null) {
      tempHitedField = newHitedField;
      hits += 1;
    }
    return
  }
  let randomMove = findRandomMove();
  while (
    isMoveLegal(randomMove[0], randomMove[1], board.getBoard()) === false
  ) {
    randomMove = findRandomMove();
  }
  hitedField = board.receiveAttack(...randomMove);
  if (hitedField.ship !== null) {
    hitedShip = hitedField.ship;
    hits += 1;
  }
}
export { aiAttack, findAdjacentFieldOnAxis };
