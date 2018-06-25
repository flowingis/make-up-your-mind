export const newIndexedArray = size => {
  if (!size) {
    return []
  }
  return [...Array(parseInt(size, 10))].map((value, index) => index)
}

export const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
