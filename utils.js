// keys :: object -> [string]
const keys = (valueObject) => Object.keys(valueObject);

// eq :: a -> b -> bool
const eq = (a) => (b) => JSON.stringify(a) === JSON.stringify(b);

// both :: fn -> fn -> a -> bool
const both = (a) => (b) => (arg) => a(arg) && b(arg);

// length :: object -> int
const length = (a) => a.length;

// pipe :: ((a -> b), (c -> d), ...) -> e -> ((e -> f), (g -> h), ...)
const pipe = (...fns) => (arg) => fns.reduce((acc, curr) => curr(acc), arg);

// match :: [f, g] -> a -> b
const match = (predFnList) => (arg) => {
  for (let [predicate, func] of predFnList) {
    if (predicate(arg)) {
      return func(arg);
    }
  }
  throw new Error('Missing match case');
};

module.exports = {
  keys,
  eq,
  both,
  length,
  pipe,
  match,
};
