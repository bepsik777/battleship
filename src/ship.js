const shipFactory = (length) => {
  
  let numberOfHits = 0;

  const getLength = () => length;
  const getNumberOfHits = () => numberOfHits

  const hit = () => {
    numberOfHits += 1
    return numberOfHits
  };

  const isSunk = () => {
    if (numberOfHits === length) return true;
    return false;
  };

  return {
    getLength,
    hit,
    isSunk,
    getNumberOfHits
  };
};

const ship = shipFactory(1);
ship.hit();

console.log(ship.getLength());
export { shipFactory };
