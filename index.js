// Challenge: complete the function "winningPokerHand" below and calculate the
// winning hand in a game of poker

// const exampleHand = [
//   { suit: 'Diamond', value: 14, face: 'Ace' },
//   { suit: 'Space', value: 14, face: 'Ace' },
//   { suit: 'Heart', value: 14, face: 'Ace' },
//   { suit: 'Club', value: 7, face: 'Seven' },
//   { suit: 'Diamond', value: 7, face: 'Seven' },
// ];

// utilities
const keys = (valueObject) => Object.keys(valueObject);
const eq = (a) => (b) => JSON.stringify(a) === JSON.stringify(b);
const gt = (a) => (b) => b > a;
const both = (a) => (b) => (arg) => a(arg) && b(arg);
const length = (a) => a.length;
const pipe = (...fns) => (arg) => fns.reduce((acc, curr) => curr(acc), arg);
const match = (predFnList) => (arg) => {
  for (let [p, f] of predFnList) {
    if (p(arg)) {
      return f(arg);
    }
  }
  throw new Error('Missing match case');
};

// poker functions
const sumHandValues = (hand) => hand.reduce((acc, curr) => acc + curr.value, 0);

const handFrequencies = (prop) => (hand) => {
  return hand.reduce((acc, curr) => {
    return acc[curr[prop]]
      ? { ...acc, [curr[prop]]: acc[curr[prop]] + 1 }
      : { ...acc, [curr[prop]]: 1 };
  }, {});
};

const ofAKind = (amount) => (hand) => {
  const vals = handFrequencies('value')(hand);
  return keys(vals).reduce((acc, curr) => {
    return acc ? acc : vals[curr] === amount;
  }, false);
};

const twoPair = (hand) => {
  const valueObject = handFrequencies('value')(hand);
  if (pipe(keys, length, gt(1))(valueObject)) {
    const count = keys(valueObject).reduce((acc, curr) => {
      return valueObject[curr] === 2 ? acc + 1 : acc;
    }, 0);
    return count === 2;
  } else {
    return false;
  }
};

// assuming player is auto-sorting their hand
const straight = (hand) => {
  for (let i = 0; i < hand.length - 1; i++) {
    const card1 = hand[i];
    const card2 = hand[i + 1];
    if (card1.value - card2.value !== 1) {
      return false;
    }
  }
  return true;
};

const flush = pipe(handFrequencies('suit'), keys, length, eq(1));

const royalFlush = (hand) => {
  return [flush, straight, pipe(sumHandValues, eq(60))]
    .map((f) => f(hand))
    .every(eq(true));
};

const bestHandValue = (hand) =>
  match([
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
