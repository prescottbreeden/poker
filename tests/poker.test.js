const { describe } = require('jest-circus');
const { expect } = require('@jest/globals');
const { both } = require('../utils');
const mocks = require('./pokerHand.mocks');
const {
  bestHandValue,
  flush,
  handFrequencies,
  ofAKind,
  royalFlush,
  straight,
  sumHandValues,
  twoPair,
  winningPokerHand,
} = require('../index');

describe('poker hand predicates', () => {
  describe('royalFlush', () => {
    it('returns true if a hand is a royal flush', () => {
      expect(royalFlush(mocks.royalFlushHand)).toBe(true);
      expect(royalFlush(mocks.straightFlushHand)).toBe(false);
    });
  });
  describe('straightFlush', () => {
    it('returns true if a hand is a straight flush', () => {
      expect(both(straight)(flush)(mocks.royalFlushHand)).toBe(true);
      expect(both(straight)(flush)(mocks.straightFlushHand)).toBe(true);
      expect(both(straight)(flush)(mocks.straightHand)).toBe(false);
    });
  });
  describe('fullhouse', () => {
    expect(both(ofAKind(3))(ofAKind(2))(mocks.fullHouseHand)).toBe(true);
    expect(both(ofAKind(3))(ofAKind(2))(mocks.twoOfAKindHand)).toBe(false);
  });
  describe('ofAKind', () => {
    it('retusn true if hand has 4 of a kind', () => {
      expect(ofAKind(4)(mocks.fourOfAKindHand)).toBe(true);
      expect(ofAKind(4)(mocks.fullHouseHand)).toBe(false);
    });
    it('retusn true if hand has 3 of a kind', () => {
      expect(ofAKind(3)(mocks.fullHouseHand)).toBe(true);
      expect(ofAKind(3)(mocks.threeOfAKindHand)).toBe(true);
      expect(ofAKind(3)(mocks.fourOfAKindHand)).toBe(false);
    });
    it('retusn true if hand has 2 of a kind', () => {
      expect(ofAKind(2)(mocks.twoOfAKindHand)).toBe(true);
      expect(ofAKind(2)(mocks.fullHouseHand)).toBe(true);
      expect(ofAKind(2)(mocks.fourOfAKindHand)).toBe(false);
    });
  });
  describe('flush', () => {
    it('returns true if hand has 1 suit', () => {
      expect(flush(mocks.royalFlushHand)).toBe(true);
      expect(flush(mocks.straightFlushHand)).toBe(true);
    });
  });
  describe('straight', () => {
    it('returns true if hand has a straight', () => {
      expect(straight(mocks.royalFlushHand)).toBe(true);
      expect(straight(mocks.straightHand)).toBe(true);
      expect(straight(mocks.fullHouseHand)).toBe(false);
    });
  });
  describe('two pair', () => {
    it('returns true if hand has two pairs', () => {
      expect(twoPair(mocks.twoPairHand)).toBe(true);
      expect(twoPair(mocks.twoOfAKindHand)).toBe(false);
      expect(twoPair(mocks.fullHouseHand)).toBe(false);
      expect(twoPair(mocks.onlyHighCardHand)).toBe(false);
    });
  });
});

describe('poker utiliities', () => {
  describe('sumHandValues', () => {
    it('returns the sum of values in a hand', () => {
      expect(sumHandValues(mocks.royalFlushHand)).toBe(60);
    });
  });
  describe('handFrequencies', () => {
    it('partially applies the first argument and returns a function', () => {
      const func = handFrequencies('suit');
      expect(typeof func).toBe('function');
    });
    it('returns an object with the frequencies of the supplied property', () => {
      const suitFrequencies = handFrequencies('suit')(mocks.fullHouseHand);
      expect(suitFrequencies).toStrictEqual({
        Diamond: 2,
        Spade: 1,
        Heart: 1,
        Club: 1,
      });
      const valueFrequencies = handFrequencies('value')(mocks.fullHouseHand);
      expect(valueFrequencies).toStrictEqual({
        14: 3,
        7: 2,
      });
      const faceFrequencies = handFrequencies('face')(mocks.fullHouseHand);
      expect(faceFrequencies).toStrictEqual({
        Ace: 3,
        Seven: 2,
      });
    });
  });

  describe('bestHandValue', () => {
    it('returns 9 if hand is a Royal Flush', () => {
      expect(bestHandValue(mocks.royalFlushHand)).toBe(9);
    });
    it('returns 8 if hand is a Straight Flush', () => {
      expect(bestHandValue(mocks.straightFlushHand)).toBe(8);
    });
    it('returns 7 if hand is a Four of a Kind', () => {
      expect(bestHandValue(mocks.fourOfAKindHand)).toBe(7);
    });
    it('returns 6 if hand is a Full House', () => {
      expect(bestHandValue(mocks.fullHouseHand)).toBe(6);
    });
    it('returns 5 if hand is a Flush', () => {
      expect(bestHandValue(mocks.flushHand)).toBe(5);
    });
    it('returns 4 if hand is a Straight', () => {
      expect(bestHandValue(mocks.straightHand)).toBe(4);
    });
    it('returns 3 if hand is a Three of a Kind', () => {
      expect(bestHandValue(mocks.threeOfAKindHand)).toBe(3);
    });
    it('returns 2 if hand is a Two Pair', () => {
      expect(bestHandValue(mocks.twoPairHand)).toBe(2);
    });
    it('returns 1 if hand is a Two of a Kind', () => {
      expect(bestHandValue(mocks.twoOfAKindHand)).toBe(1);
    });
    it('returns 0 if hand only has a high card', () => {
      expect(bestHandValue(mocks.onlyHighCardHand)).toBe(0);
    });
  });

  describe('winningPokerHand', () => {
    it('returns "Player 1 wins" if hand 1 is higher value', () => {
      expect(winningPokerHand(mocks.twoPairHand, mocks.onlyHighCardHand)).toBe(
        'Player 1 wins'
      );
    });
    it('returns "Player 2 wins" if hand 2 is higher value', () => {
      expect(winningPokerHand(mocks.onlyHighCardHand, mocks.twoPairHand)).toBe(
        'Player 2 wins'
      );
    });
    it('returns "play war!" if there is a tie', () => {
      expect(winningPokerHand(mocks.twoPairHand, mocks.twoPairHand)).toBe(
        'play war!'
      );
    });
  });
});
