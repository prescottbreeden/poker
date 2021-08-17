const royalFlushHand = [
  { suit: 'Spade', value: 14, face: 'Ace' },
  { suit: 'Spade', value: 13, face: 'King' },
  { suit: 'Spade', value: 12, face: 'Queen' },
  { suit: 'Spade', value: 11, face: 'Jack' },
  { suit: 'Spade', value: 10, face: 'Ten' },
];
const straightFlushHand = [
  { suit: 'Spade', value: 13, face: 'King' },
  { suit: 'Spade', value: 12, face: 'Queen' },
  { suit: 'Spade', value: 11, face: 'Jack' },
  { suit: 'Spade', value: 10, face: 'Ten' },
  { suit: 'Spade', value: 9, face: 'Nine' },
];
const fourOfAKindHand = [
  { suit: 'Diamond', value: 14, face: 'Ace' },
  { suit: 'Spade', value: 14, face: 'Ace' },
  { suit: 'Heart', value: 14, face: 'Ace' },
  { suit: 'Club', value: 14, face: 'Ace' },
  { suit: 'Diamond', value: 7, face: 'Seven' },
];
const fullHouseHand = [
  { suit: 'Diamond', value: 14, face: 'Ace' },
  { suit: 'Spade', value: 14, face: 'Ace' },
  { suit: 'Heart', value: 14, face: 'Ace' },
  { suit: 'Club', value: 7, face: 'Seven' },
  { suit: 'Diamond', value: 7, face: 'Seven' },
];
const flushHand = [
  { suit: 'Spade', value: 13, face: 'King' },
  { suit: 'Spade', value: 11, face: 'Jack' },
  { suit: 'Spade', value: 10, face: 'Ten' },
  { suit: 'Spade', value: 9, face: 'Nine' },
  { suit: 'Spade', value: 2, face: 'Two' },
];
const straightHand = [
  { suit: 'Spade', value: 13, face: 'King' },
  { suit: 'Club', value: 12, face: 'Queen' },
  { suit: 'Spade', value: 11, face: 'Jack' },
  { suit: 'Spade', value: 10, face: 'Ten' },
  { suit: 'Spade', value: 9, face: 'Nine' },
];
const threeOfAKindHand = [
  { suit: 'Spade', value: 13, face: 'King' },
  { suit: 'Club', value: 13, face: 'King' },
  { suit: 'Heart', value: 13, face: 'King' },
  { suit: 'Spade', value: 10, face: 'Ten' },
  { suit: 'Spade', value: 9, face: 'Nine' },
];
const twoPairHand = [
  { suit: 'Spade', value: 13, face: 'King' },
  { suit: 'Club', value: 13, face: 'King' },
  { suit: 'Spade', value: 11, face: 'Jack' },
  { suit: 'Diamond', value: 11, face: 'Jack' },
  { suit: 'Spade', value: 9, face: 'Nine' },
];
const twoOfAKindHand = [
  { suit: 'Spade', value: 13, face: 'King' },
  { suit: 'Club', value: 13, face: 'King' },
  { suit: 'Spade', value: 11, face: 'Jack' },
  { suit: 'Spade', value: 10, face: 'Ten' },
  { suit: 'Spade', value: 9, face: 'Nine' },
];
const onlyHighCardHand = [
  { suit: 'Spade', value: 13, face: 'King' },
  { suit: 'Diamong', value: 10, face: 'Ten' },
  { suit: 'Spade', value: 9, face: 'Nine' },
  { suit: 'Heart', value: 5, face: 'Five' },
  { suit: 'Club', value: 2, face: 'Two' },
];

module.exports = {
  flushHand,
  fourOfAKindHand,
  fullHouseHand,
  onlyHighCardHand,
  royalFlushHand,
  straightFlushHand,
  straightHand,
  threeOfAKindHand,
  twoOfAKindHand,
  twoPairHand,
};
