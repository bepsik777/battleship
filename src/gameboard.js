import { shipFactory } from "./ship.js";

export const gameboardFactory = () => {
  const board = [];

  const getBoard = () => board;

  function createField(x, y) {
    return {
      position: [x, y],
      occupiedByShip: false,
      hit: false,
      ship: null,
    };
  }

  function initGameboard() {
    for (let i = 0; i < 10; i++) {
      const arr = [];
      for (let j = 0; j < 10; j++) {
        arr.push(createField(i, j));
      }
      board.push(arr);
    }
  }

  function printBoard() {
    board.forEach((row) => {
      let string = "";
      row.forEach((field) => {
        if (!field.occupiedByShip) {
          string += `| ${field.position} |`;
        } else if (field.occupiedByShip) {
          string += "|  X  |";
        }
      });
      console.log(string);
    });
  }

  function findNeighbourFields(targetFields) {
    if (!targetFields) return false;
    const board = getBoard();
    let duplicatedNeighbours = [];
    const neighbours = [];
    const possbileNeighbours = [];

    targetFields.forEach((field) => {
      const x = field.position[0];
      const y = field.position[1];

      // all the possible neighbour fields
      const possibleNeighboursCoordinates = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y],
        [x + 1, y - 1],
        [x, y - 1],
      ];

      // push the neighbour fields that are not out of bounds
      possibleNeighboursCoordinates.forEach((coordinate) => {
        if (isOutOfBound(coordinate[0], coordinate[1]) === false)
          possbileNeighbours.push(board[coordinate[0]][coordinate[1]]);
      });
    });

    // add only neighbours that are not included in the target fields array

    duplicatedNeighbours = possbileNeighbours.filter(
      (neighbour) => targetFields.includes(neighbour) === false,
    );

    duplicatedNeighbours.forEach((field) => {
      if (!neighbours.includes(field)) neighbours.push(field);
    });

    return neighbours;
  }

  function findTargetFields(shipLength, x, y, direction, board) {
    const targetFields = [];
    for (let i = 0; i < shipLength; i++) {
      if (direction === "horizontal") {
        if (isOutOfBound(x, y + i)) {
          console.log("out of bounds");
          return false;
        }
        targetFields.push(board[x][y + i]);
      } else if (direction === "vertical") {
        if (isOutOfBound(x + i, y)) {
          console.log("out of bounds");
          return false;
        }
        targetFields.push(board[x + i][y]);
      }
    }
    return targetFields;
  }

  function isOutOfBound(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 9) return true;
    return false;
  }

  function checkIfFieldOccupied(field) {
    return field.occupiedByShip === true;
  }

  function canShipBePlaced(targetFields, neighbourFields) {
    console.log(targetFields, "target fields");
    if (!targetFields) return false;

    // if fields are already occupied, or neighbour fields are occupied, return false
    if (
      targetFields.some(checkIfFieldOccupied) ||
      neighbourFields.some(checkIfFieldOccupied)
    ) {
      return false;
    }

    return true;
  }

  function placeShip(shipLength, x, y, direction = "horizontal") {
    const board = getBoard();
    const targetFields = findTargetFields(shipLength, x, y, direction, board);
    const neighbourFields = findNeighbourFields(targetFields);
    if (!canShipBePlaced(targetFields, neighbourFields))
      return "ship cant be placed here";
    const ship = shipFactory(shipLength);

    targetFields.forEach((field) => {
      field.occupiedByShip = true;
      field.ship = ship;
    });
  }

  function receiveAttack(x, y) {
    if (isOutOfBound(x,y)) {
      console.log("out of bounds");
      return false;
    }

    if (board[x][y].ship !== null) board[x][y].ship.hit()

    board[x][y].hit = true
  }

  return {
    createField,
    initGameboard,
    printBoard,
    getBoard,
    findTargetFields,
    findNeighbourFields,
    canShipBePlaced,
    placeShip,
    receiveAttack,
  };
};

const boardObject = gameboardFactory();
boardObject.initGameboard();
boardObject.placeShip(4, 4, 4, "vertical");
boardObject.placeShip(2, 9, 8, "horizontal");
boardObject.placeShip(2, 0, 9, "horizontal");
boardObject.placeShip(2, 7, 8, "horizontal");
// console.log(board[4][4], "board");
boardObject.printBoard();
