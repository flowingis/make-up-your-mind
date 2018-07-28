export const clamp = (number, min, max) => {
  if (typeof min !== 'undefined' && number < min) {
    return min
  }

  if (typeof max !== 'undefined' && number > max) {
    return max
  }

  return number
}
