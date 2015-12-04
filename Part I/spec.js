// DISCLAIMER: I don't have anything against semicolons,
// I simply chose https://github.com/feross/standard/ as the code style for my
// private projects.

const test = require('tape')
const Promise = require('bluebird')
const noMoreThanNTimesPerSecond = require('./noMoreThanNTimesPerSecond')

// Returns a function that returns the sum of all arguments it was ever called
// with plus the init value.
// Good for testing that the args are passed as well, though that could be
// split into a different unit tests.
const addToLastGenerator = init => {
  return function (...args) {
    init = args.reduce((i, j) => i + j, init)
    return init
  }
}

const throwError = () => {
  throw Error()
}

const catchError = (fn) => {
  try {
    fn()
  } catch (error) {
    return error
  }
}

test('noMoreThan0TimesPerSecond', t => {
  const fun = noMoreThanNTimesPerSecond(() => true, 0)

  t.equal(fun(), undefined, 'don\' ever call')
  t.end()
})

test('noMoreThan1TimesPerSecond throwing no Error', t => {
  const fun = noMoreThanNTimesPerSecond(addToLastGenerator(0), 1)

  return Promise.resolve()
    .then(() => t.equal(fun(1, 2), 3, 'call the first time'))
    .then(() => t.equal(fun(1, 2, 3), 3, 'don\'t call the second time'))
    // using a mock clock would make the test more predictable,
    // though 1 second seems to be quite enough time to add a couple of
    // numbers even on something like a raspberry-pi
    // that said, a mock clock would still be cleaner :)
    .delay(1001)
    .then(() => t.equal(fun(2, 3), 8, 'call again after one second'))
    .then(() => t.equal(fun(1, 2, 3), 8, 'don\'t call the second time'))
    .then(() => t.end())
})

// will fail since I chose not to implement that case, see the README.md
// test('slidingTimeWindow', t => {
//   const fun = noMoreThanNTimesPerSecond(addToLastGenerator(0), 3)
//
//   return Promise.resolve()
//     .then(() => t.equal(fun(1), 1, 'first time in the first second'))
//     .delay(900)
//     .then(() => t.equal(fun(1), 2, 'second time in the first second'))
//     .then(() => t.equal(fun(1), 3, 'third time in the first second'))
//     .delay(200)
//     .then(() => t.equal(fun(1), 4, 'first time in the second second'))
//     .then(() => t.equal(fun(1), 4, 'second time in the second second, BUT fourth time within a second'))
//     .then(() => t.end())
// })

test('noMoreThan3TimesPerSecond throwing an Error', t => {
  const fun = noMoreThanNTimesPerSecond(throwError, 3)

  return Promise.resolve()
    .then(() => {
      const e1 = catchError(fun)
      const e2 = catchError(fun)

      t.ok(e1 instanceof Error, 'throws an error')
      t.ok(e2 instanceof Error, 'throws an error')
      t.notEqual(e1, e2, 'threw different errors')
    })
    .then(() => {
      const e1 = catchError(fun)
      const e2 = catchError(fun)

      t.ok(e1 instanceof Error, 'throws an error')
      t.ok(e2 instanceof Error, 'throws an error')

      t.equal(e1, e2, 'rethrows the last error')
    })
    .delay(1001)
    .then(() => {
      const e1 = catchError(fun)
      const e2 = catchError(fun)

      t.ok(e1 instanceof Error, 'throws an error')
      t.ok(e2 instanceof Error, 'throws an error')
      t.notEqual(e1, e2, 'threw different errors')
    })
    .then(() => {
      const e1 = catchError(fun)
      const e2 = catchError(fun)

      t.ok(e1 instanceof Error, 'throws an error')
      t.ok(e2 instanceof Error, 'throws an error')

      t.equal(e1, e2, 'rethrows the last error')
    })
    .then(() => t.end())
})
