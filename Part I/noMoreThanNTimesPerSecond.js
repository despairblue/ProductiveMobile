module.exports = exports = (fn, n) => {
  let lastTimeLapse = Date.now()
  let lastResult
  let calls = 0

  // error handling shamelessly stolen from
  // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#2-unsupported-syntax
  // @see workarounds further down the chapter
  const errorObject = {value: null}
  const tryCatch = (fn, args) => {
    try {
      return fn.apply(undefined, args)
    } catch (e) {
      errorObject.value = e
      return errorObject
    }
  }

  return (...args) => {
    const now = Date.now()

    // reset timer and call count
    if (now - lastTimeLapse > 1000) {
      lastTimeLapse = now
      calls = 0
    }

    // call it again if possible
    if (calls < n) {
      calls = calls + 1

      lastResult = tryCatch(fn, args)
    }

    // return or throw
    if (lastResult === errorObject) {
      throw errorObject.value
    } else {
      return lastResult
    }
  }
}
