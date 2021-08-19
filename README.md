# Poker Hand Evaluation
## Install
`yarn` </br>

## To run tests and coverage:
tests: `yarn jest` </br>
coverage `yarn jest --coverage`

#### There are no dependencies besides Jest

---
## Why I like this code
_Disclaimer: I know nothing and my opinions are just that. However, I am sometimes asked why I like to write code like this, so I thought I might try and put some words down._
### Extensible Abstractions
Some abstractions do not need naming. For instance, in an imperative style, the requirement to test a "straight flush" might have its own function declaration just like "royalFlush":

```js
function straightFlush(hand) {
    return straight(hand) && flush(hand);
}
```

In many instances however, I think quite a bit of declarativeness is lost. If you were explaining this game to a friend or a child, and if someone asked "what is a straight flush", you might say it's a hand that is both a straight and a flush:

```js
both(straight)(flush)(hand);
```

The logical question to ask is, where does it make sense to create a new abstraction? I don't think there is a tried-and-true answer to this. For instance, I could have created the logic for a Royal Flush with an "all" function and then written it:

```js
all([straight, flush, pipe(sumHandValues, eq(60)))(hand)
```

The primary reason I did not do this was because it is not necessarily obvious what a sum of 60 has to do with anything, and unless someone was very quick with math, this has very little meaning.

However, such is not the case with a fullhouse, where it is a hand that has a 3 of a kind and a 2 of a kind:

```js
both(ofAKind(3))(ofAKind(2))
```
You could also explain that a full house is when a 5-card hand only has two different face cards:
```js
pipe(handFrequencies('face'), keys, length, eq(2))
```
And if we decided it made sense to build an abstraction for a fullhouse, both of these are perfectly valid within a 5-card domain, but if we were planning on expanding the system for higher-carded games, only one of these will work:
```js
const fullHouse = both(ofAKind(3))(ofAKind(2));
const fullHouse = pipe(handFrequencies('face'), keys, length, eq(2)); // assumes 5-cards
```
---
## Comparing against a popular library
For comparison, here is the abstraction for a flush that I used:
```js
// flush :: [card] -> boolean
const flush = pipe(handFrequencies('suit'), keys, length, eq(1));
```
Here is the abstraction for a flush from a popular github [repository]("https://github.com/goldfire/pokersolver/blob/master/pokersolver.js"):
```js
    /**
     * Determine the cards in a suit for a flush.
     * @param  {String} suit Key for this.suits.
     * @param  {Boolean} setRanks Whether to set the ranks for the wild cards.
     * @return {Array} Cards having the suit, including wild cards.
     */
    getCardsForFlush(suit, setRanks) {
      var cards = (this.suits[suit] || []).sort(Card.sort);

      for (var i=0; i<this.wilds.length; i++) {
        var wild = this.wilds[i];

        if (setRanks) {
          var j=0;
          while (j<values.length && j<cards.length) {
            if (cards[j].rank === values.length-1-j) {
              j += 1;
            } else {
              break;
            }
          }
          wild.rank = values.length-1-j;
          wild.wildValue = values[wild.rank];
        }

        cards.push(wild);
        cards = cards.sort(Card.sort);
      }

      return cards;
    }
```
It is obvious that one of the key differences is that this implementation handles wild cards which is a common ability in various games. However, we can extend our code to capture this behavior as well:

```js
const flush = pipe(handFrequencies('suit'), keys, filter('wild'), length, eq(1));
```
To create this new abstraction, we would update the handFrequencies function to produce `wild` keys, filter those keys when looking for a flush, and then evaluate the remaining.

I do not intend to impugn this particular library, it seems quite popular and I'm sure a great deal of effort has gone into its creation and maintenance, but I want to point out that outside of a couple hundred lines of game-specific logic, the library doesn't really do that much more yet it resulted in a file with more than 1,800 lines of code, when this repo achieved much of the core hand-calculation logic with about 80 lines of code. 

The key reason for this boils down to missing abstractions and too much inheritance, and if you scroll through you will notice it devotes hundreds of lines of logic to differentiating "full house", "four of a kind", "three of a kind", and "pair", despite these all being essentially a single abstraction: 

```js
both(ofAKind(3))(ofAKind(2)) // fullhouse
ofAKind(4) // 4 of a kind
ofAKind(3) // 3 of a kind
ofAKind(2) // a pair
```
While there is nothing wrong with classes and OO, there is tremendous benefit from being able to adopt smaller, lighter, and more flexible abstractions.