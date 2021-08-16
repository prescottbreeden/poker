/*
    calculate the winning hand in a game of poker with the following rules:

   *
    Royal flush - The five highest cards with values in sequential order and the same suit Will always be 10, J, Q, K, A - 
    Straight flush - Five cards with values in sequential order and the same suit
    Four of a kind- Four cards with the same value - 
    Full house - Three cards with the same value and two other cards with the same value -
    Flush - All five cards with the same suit.
    Straight - All five cards with values in sequential order
    Three of a kind - Three cards with the same value
    Two pair - Two cards with the same value and two other cards with the same value
    One pair - Two cards with the same value
    High card - Highest card in the hand
   *
*/

// example hand
// const hand = [
//   { suit: 'Diamond', value: 14, face: 'Ace' },
//   { suit: 'Space', value: 14, face: 'Ace' },
//   { suit: 'Heart', value: 14, face: 'Ace' },
//   { suit: 'Club', value: 7, face: 'Seven' },
//   { suit: 'Diamond', value: 7, face: 'Seven' },
// ];

const buildHandValues = (prop) => (hand) => {
  return hand.reduce((acc, curr) => {
    return acc[curr.face]
      ? { ...acc, [curr[prop]]: acc[curr[prop]] + 1 }
      : { ...acc, [curr[prop]]: 1 };
  }, {});
};

// 'Ace': 3, 'Seven' : 2
const match = (predFnList) => (arg) => {
  for (let [p, f] in predFnList) {
    if (p(arg)) {
      return f(arg);
    }
  }
  throw new Error('Missing match case');
};
const keys = (valueObject) => Object.keys(valueObject);
const eq = (a) => (b) => JSON.stringify(a) === JSON.stringify(b);
const both = (a) => (b) => (arg) => a(arg) && b(arg);
const pipe = (...fns) => (arg) => fns.reduce((acc, curr) => curr(acc), arg);

const fullhouse = pipe(buildHandValues('value'), keys, (x) => x.length, eq(2));
const flush = pipe(buildHandValues('suit'), keys, (x) => x.length, eq(1));

const ofAKind = (amount) => (hand) => {
  const vals = buildHandValues('value')(hand);
  return vals.reduce((acc, curr) => {
    return acc ? acc : vals[curr] === amount;
  }, false);
};

const getHighCard = (hand) => {
  return hand.reduce((acc, curr) => {
    return curr.value > acc ? curr.value : acc;
  }, -Infinity);
};

const twoPair = (hand) => {
  // must have 2 keys in value object
  // 2 of those keys must have 2 cards
  const valueObject = buildHandValues('value')(hand);
  if (countKeys(vals) === 2) {
    const count = keys(valueObject).reduce((acc, curr) => {
      if (valueObject[curr] === 2) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    return count === 2 ? true : false;
  }
  return false;
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

const royalFlush = (hand) => {
  const isStraight = straight(hand);
  const isSingleSuit = keys(buildHandValues('suit')(hand)).length === 1;
  const sumIs60 = hand.reduce((acc, curr) => acc + curr.value, 0) === 60;
  return sumIs60 && isSingleSuit && isStraight;
};

const bestHandValue = match([
  [royalFlush, () => 9],
  [both(flush)(straight), () => 8],
  [ofAKind(4), () => 7],
  [fullhouse, () => 6],
  [flush, () => 5],
  [straight, () => 4],
  [ofAKind(3), () => 3],
  [twoPair, () => 2],
  [ofAKind(2), () => 1],
  [() => true, () => 0],
]);

function winningPokerHand(hand1, hand2) {
  const hand1Value = bestHandValue(hand1);
  const hand2Value = bestHandValue(hand2);

  if (hand1Value > hand2Value) {
    return 'Player 1 wins!!!!';
  } else if (hand2Value > hand1Value) {
    return 'Player 2 wins!!!!';
  } else {
    return 'play war!';
  }
}
