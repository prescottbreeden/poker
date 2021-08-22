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

i do not intend to impugn this particular library, nor am I suggest lines of code as a measure of quality (with golf rules). In fact, it seems that this library is quite popular and there is nothing inately bad about it. My intention to to point out the difficulty the style has to take advantage of discovered abstractions. Because each of the methods of this library are tied to the state of an object, extending them is difficult without redesign. In fact, it would be perfectly doable to rewrite this library to use the same kind of abstraction I used. The difference is not about the capability of the style, but rather the unfortunate reality that abstractions are discovered more often then they are disgned. When I was writing this code, initially my `handFrequencies` function only returned card values. However, once I started working on hands that required suit information, it became clear I could use the same function if I wrapped it in a Higher Order Function to inject the card property `suit` or `value` or `face`. Adding this had very little cost, as would adding a filter for wild cards or an "n-away" function to evaluate wild cards for required face/value hands such as with a straight.

This is important because as Kevlin Henney teaches, when faced with a fork in the road of two options, the important thing is not which choice you choose, but the fact that a choice exists. Given the choice between two options, it is best to design your code so that choice is less important. 

As I was building this, another function that was initially called `fourOfAKing` examined a hand for 4 instances of a face card. Once completed and I moved onto `fullHouse`, it was obvious that instead of hardcoding the values I could simply wrap it in a Higher Order Function as well and inject the frequency I was looking for. With that minor modification, `fourOfAKind` became `ofAKind` and then I simply had to ensure that a hand qualified for both a `ofAKind(3)` and a `ofAKind(2)` and logic was complete. However, if you look at the library you will notice that it devotes hundreds of lines of logic to differentiating "full house", "four of a kind", "three of a kind", and "pair", despite these all being essentially a single abstraction: 

```js
both(ofAKind(3))(ofAKind(2)) // fullhouse
ofAKind(4) // 4 of a kind
ofAKind(3) // 3 of a kind
ofAKind(2) // a pair
```