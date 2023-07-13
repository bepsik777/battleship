import { shipFactory } from "../ship.js"

test('get length of 5 space ship', () => {
    const ship = shipFactory(5)
    expect(ship.getLength()).toBe(5)
})

test('get hit', () => {
    const ship = shipFactory(5)
    expect(ship.hit()).toBe(1)
})

test('is sunk', () => {
    const ship = shipFactory(5)
    expect(ship.isSunk()).toBe(false)
})

test('is sunk when length is 0', () => {
    const ship = shipFactory(0)
    expect(ship.isSunk()).toBe(true)
})

test('is sunk after enough hits', () => {
    const ship = shipFactory(1)
    ship.hit()
    expect(ship.isSunk()).toBe(true)
})