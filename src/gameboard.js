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

  function findNeighbourFields(field, arrayToCheck) {
    const x = field.position[0];
    const y = field.position[1];
    const board = getBoard();
    let neighbours = [];
    const possbileNeighbours = [];

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

    // add only neighbours that are not included in the counter array
    neighbours = possbileNeighbours.filter(
      (neighbour) => arrayToCheck.includes(neighbour) === false,
    );

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

  function canShipBePlaced(shipLength, x, y, direction = "horizontal") {
    // if (x > 9 || x < 0 || y > 9 || y < 0) return false;
    const board = getBoard();
    const fields = findTargetFields(shipLength, x, y, direction, board);
    const neighbourFields = [];

    if (!fields) return false;

    // find the neighbor fields
    fields.forEach((field) => {
      const neighbours = findNeighbourFields(field, fields);
      neighbours.forEach((field) => {
        if (!neighbourFields.includes(field)) neighbourFields.push(field);
      });
    });

    // if fields are already occupied, or neighbour fields are occupied, return false
    if (
      fields.some(checkIfFieldOccupied) ||
      neighbourFields.some(checkIfFieldOccupied)
    ) {
      return false;
    }
    console.log(fields);
    console.log(neighbourFields);

    return true;
  }

  // function placeShip(shipLength, x, y, alignment) {
  //     const ship = shipFactory(shipLength)
  // }

  return {
    createField,
    initGameboard,
    printBoard,
    getBoard,
    canShipBePlaced,
  };
};

const boardObject = gameboardFactory();
boardObject.initGameboard();
boardObject.printBoard();

console.log(boardObject.canShipBePlaced(5, 12, 14, "vertical"));
