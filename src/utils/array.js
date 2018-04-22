export const newIndexedArray = size => {
  if (!size) {
    return []
  }
  return [...Array(parseInt(size, 10))].map((value, index) => index)
}
