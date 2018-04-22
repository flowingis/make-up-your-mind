export const newIndexedArray = size => {
  return [...Array(parseInt(size, 10))].map((value, index) => index)
}
