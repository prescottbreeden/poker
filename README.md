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
### Minimal Abstractions
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

The reasons I didn't are: 
1) It is not necessarily obvious what a sum of 60 has to do with anything, and unless someone was very quick with math, this has very little meaning.
2) This was written during a timed technical interview and I didn't want to spend the time writing an all expression that I didn't really need to get the job done.

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
While this is not yet a normal style in JavaScript, it has maintainability benefits as well as readability benefits.

### Readability
"Self-documenting" code is a buzz-word that gets tossed around in promiscious ways. Often, I hear it used in the "my code is self documenting, therefore it doesn't need comments or documentation." My problem with this sentiment (that I catch myself over) is what is the operational definition of "self-documenting." The definition of pornography, "I know it when I see it" does _not_ fit the standard in my book. To me, the goal must be a declarative style and must be more than just "a function with a good name." Good naming is important, but self-documenting code is code that reads to anyone unfamiliar with the language and has a testing suite that can be found to explain how the code works.

### Maintainability
In the first version of `straightFlush`, it would be much easier to break the requirements by adding extra code. However, when functions are built from a series smaller abstractions, the only way to change the output of a function is to change an unrelated function (which will likely break a whole suite of tests) or to add an aditional function. Something would suddenly looks very odd if you saw:

```js
both(straight)(flush)(ofAKind(2))(hand)
```
This code would immediately crash, but even a non-crashing version would set off some pretty strong warning bells since the business logic is encoded in the syntax:

```js
all([straight(hand), flush(hand), ofAKind(2)(hand)])
```

### etc.
There are other strengths to this style and if you are interested to hear me ramble on further, feel free to send me a note, I'm always happy to chat about code.

---
## Yes, this code has a cost.
Functional code creates a lot of limitation around what you can do. Hacky solutions are harder to implement, which means bug fixes can take longer, and getting new devs up to speed can require teaching alien concepts if they have never worked with a functional language. However, the point is not that this style is free, the point is that restrictions are often beneficial. 

As an example: the most powerful iterator in just about any language is a while loop where you can choose to do anything you like, and just below that is a for loop. Nobody will argue that a map, filter, or reduce/fold is more powerful than a for loop, it is the opposite. However, code that relies on map, filter, reduce/fold is stronger than code that relies on while/for loops because their strength is in the restrictions they impose.

>"My freedom thus consists in my moving about within the narrow frame that I have assigned myself for each one of my undertakings.  I shall go even further: my freedom will be so much the greater and more meaningful the more narrowly I limit my field of action and the more I surround myself with obstacles. Whatever diminishes constraint, diminishes strength. The more constraints one imposes, the more one frees one’s self of the chains that shackle the spirit." - Igor Stravinsky


---
Note: "Because it is cool" is nowhere on my list of why I like this code.