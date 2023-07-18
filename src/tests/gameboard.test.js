import { shipFactory } from "../ship.js";
import { gameboardFactory } from "../gameboard.js";
const gameboard = gameboardFactory();

test("create field", () => {
  expect(gameboard.createField(0, 0)).toEqual({
    position: [0, 0],
    occupiedByShip: false,
    hit: false,
    ship: null,
  });
});

describe("place ship on board", () => {
  gameboard.initGameboard();
  const ship = shipFactory(3);
  const shipLength = ship.getLength();
  const board = gameboard.getBoard();
  
  board[0][0].occupiedByShip = true;
  board[0][1].occupiedByShip = true;
  board[0][2].occupiedByShip = true;

  test("can't be placed out of bounds", () => {
    const targetFields = gameboard.findTargetFields(
      shipLength,
      12,
      14,
      "horizontal",
      board,
    );
    const neighbourFields = gameboard.findNeighbourFields(targetFields);
    expect(gameboard.canShipBePlaced(targetFields, neighbourFields)).toBe(false);
  });

  test("can't be placed on an already occupied field", () => {
    const targetFields = gameboard.findTargetFields(
        shipLength,
        0,
        0,
        "horizontal",
        board,
      );
      const neighbourFields = gameboard.findNeighbourFields(targetFields);
    expect(gameboard.canShipBePlaced(targetFields, neighbourFields)).toBe(false);
  });

  test("can't be placed on a field which edges touch another ship", () => {
    const targetFields = gameboard.findTargetFields(
        shipLength,
        1,
        1,
        "horizontal",
        board,
      );
      const neighbourFields = gameboard.findNeighbourFields(targetFields)
    expect(gameboard.canShipBePlaced(targetFields, neighbourFields)).toBe(false);
  });

  test("place ship", () => {
    gameboard.placeShip(3, 0, 0, "horizontal");
    expect(board[0][0].occupiedByShip).toBe(true);
    expect(board[0][1].occupiedByShip).toBe(true);
    expect(board[0][2].occupiedByShip).toBe(true);
  });
});
