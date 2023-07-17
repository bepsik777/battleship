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
  const ship = shipFactory(5);
  const shipLength = ship.getLength();
  gameboard.initGameboard();
  const board = gameboard.getBoard();
  board[0][0].occupiedByShip = true;
  board[0][1].occupiedByShip = true;
  board[0][2].occupiedByShip = true;

  test("can't be placed out of bounds", () => {
    expect(gameboard.canShipBePlaced(shipLength, 12, 14)).toBe(false);
  });

  test("can't be placed on an already occupied field", () => {
    expect(gameboard.canShipBePlaced(shipLength, 0, 0)).toBe(false);
  });

  test("can't be placed on a field which edges touch another ship", () => {
    expect(gameboard.canShipBePlaced(shipLength, 1, 1)).toBe(false);
  });
});
