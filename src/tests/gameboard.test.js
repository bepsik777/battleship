import { shipFactory } from "../ship.js";
import { gameboardFactory } from "../gameboard.js";
const gameboard = gameboardFactory();
gameboard.initGameboard();
const board = gameboard.getBoard();

test("create field", () => {
  expect(gameboard.createField(0, 0)).toEqual({
    position: [0, 0],
    occupiedByShip: false,
    hit: false,
    ship: null,
  });
});

describe("place ship on board", () => {
  const ship = shipFactory(3);
  const shipLength = ship.getLength();
  gameboard.placeShip(3, 0, 0, "horizontal");

  test("can't be placed out of bounds", () => {
    const targetFields = gameboard.findTargetFields(
      shipLength,
      12,
      14,
      "horizontal",
      board,
    );
    const neighbourFields = gameboard.findNeighbourFields(targetFields);
    expect(gameboard.canShipBePlaced(targetFields, neighbourFields)).toBe(
      false,
    );
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
    expect(gameboard.canShipBePlaced(targetFields, neighbourFields)).toBe(
      false,
    );
  });

  test("can't be placed on a field which edges touch another ship", () => {
    const targetFields = gameboard.findTargetFields(
      shipLength,
      1,
      1,
      "horizontal",
      board,
    );
    const neighbourFields = gameboard.findNeighbourFields(targetFields);
    expect(gameboard.canShipBePlaced(targetFields, neighbourFields)).toBe(
      false,
    );
  });

  test("place ship", () => {
    expect(board[0][0].occupiedByShip).toBe(true);
    expect(board[0][1].occupiedByShip).toBe(true);
    expect(board[0][2].occupiedByShip).toBe(true);
  });
});

describe('receive attack', () => {
    gameboard.placeShip(3, 0, 0, "horizontal");

    test('receive attack on empty field', () => {
        gameboard.receiveAttack(5,5)
        expect(board[5][5].hit).toEqual(true)
    })

    test('receive attack on field occupied by ship', () => {
        gameboard.receiveAttack(0, 1)
        expect(board[0][1].hit).toEqual(true)
        expect(board[0][1].ship.getNumberOfHits()).toEqual(1)
        expect(board[0][0].ship.getNumberOfHits()).toEqual(1)
    })

    test('attack out fo bounds', () => {
        expect(gameboard.receiveAttack(22, 0)).toEqual(false)
    })

    test("can't attack already hit field", () => {
        gameboard.receiveAttack(0,0)
        expect(gameboard.receiveAttack(0,0)).toEqual(false)
    })
})
