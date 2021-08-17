const { keys, eq, gt, both, length, pipe, match } = require('./utils');

// Challenge: complete the function "winningPokerHand" below and calculate the
// winning hand in a game of poker

// Card Definition:
// { suit: string, value: number, face: string }

// const exampleHand = [
//   { suit: 'Diamond', value: 14, face: 'Ace' },
//   { suit: 'Space', value: 14, face: 'Ace' },
//   { suit: 'Heart', value: 14, face: 'Ace' },
//   { suit: 'Club', value: 7, face: 'Seven' },
//   { suit: 'Diamond', value: 7, face: 'Seven' },
// ];

// sumHandValues :: [card] -> number
const sumHandValues = (hand) => hand.reduce((acc, curr) => acc + curr.value, 0);

// handFrequencies :: string -> [card] -> { [string]: number }
const handFrequencies = (prop) => (hand) => {
  // frequencies of a property in a hand
  return hand.reduce((acc, curr) => {
    return acc[curr[prop]]
      ? { ...acc, [curr[prop]]: acc[curr[prop]] + 1 }
      : { ...acc, [curr[prop]]: 1 };
  }, {});
};

// ofAKind :: number -> [card] -> boolean
const ofAKind = (amount) => (hand) => {
  // value frequencies of n-ammount
  const vals = handFrequencies('value')(hand);
  return keys(vals).reduce((acc, curr) => {
    return acc ? acc : vals[curr] === amount;
  }, false);
};

// twoPair :: [card] -> boolean
const twoPair = (hand) => {
  // value frequency with 2 keys with value of 2
  const valueObject = handFrequencies('value')(hand);
  const count = keys(valueObject).reduce((acc, curr) => {
    return valueObject[curr] === 2 ? acc + 1 : acc;
  }, 0);
  return count === 2;
};

// straight :: [card] -> boolean
const straight = (hand) => {
  // all values in sorted hand 1 away
  for (let i = 0; i < hand.length - 1; i++) {
    const card1 = hand[i];
    const card2 = hand[i + 1];
    if (card1.value - card2.value !== 1) {
      return false;
    }
  }
  return true;
};

// flush :: [card] -> boolean
const flush = pipe(handFrequencies('suit'), keys, length, eq(1));

// royalFlush :: [card] -> boolean
const royalFlush = (hand) => {
  // hand is a flush, a straight, and has a value sum of 60
  return [flush, straight, pipe(sumHandValues, eq(60))]
    .map((f) => f(hand))
    .every(eq(true));
};

// bestHandValue :: [card] -> number
const bestHandValue = (hand) => {
  // get the value of a poker hand
  return match([
    [royalFlush, () => 9],
    [both(straight)(flush), () => 8],
    [ofAKind(4), () => 7],
    [both(ofAKind(3))(ofAKind(2)), () => 6],
    [flush, () => 5],
    [straight, () => 4],
    [ofAKind(3), () => 3],
    [twoPair, () => 2],
    [ofAKind(2), () => 1],
    [() => true, () => 0],
  ])(hand);
};

function winningPokerHand(hand1, hand2) {
  const hand1Value = bestHandValue(hand1);
  const hand2Value = bestHandValue(hand2);

  if (hand1Value > hand2Value) {
    return 'Player 1 wins';
  } else if (hand2Value > hand1Value) {
    return 'Player 2 wins';
  } else {
    return 'play war!';
  }
}

// see poker.test.js for examples
module.exports = {
  bestHandValue,
  both,
  eq,
  flush,
  gt,
  handFrequencies,
  keys,
  length,
  ofAKind,
  pipe,
  royalFlush,
  straight,
  sumHandValues,
  twoPair,
  winningPokerHand,
};
