const shipFactory = (length) => {
  const shipLength = length;
  
  let numberOfHits = 0;

  const getLength = () => shipLength;

  const hit = () => {
    numberOfHits += 1
    return numberOfHits
  };

  const isSunk = () => {
    if (numberOfHits === shipLength) return true;
    return false;
  };

  return {
    getLength,
    hit,
    isSunk,
  };
};

const ship = shipFactory(1);
ship.hit();

console.log(ship.getLength());
export { shipFactory };
