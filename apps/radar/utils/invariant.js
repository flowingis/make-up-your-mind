const DEFAULT_MESSAGE = 'Invariant Violation'

export default (condition, message = DEFAULT_MESSAGE) => {
  if (condition) {
    return
  }

  throw new Error(message)
}
