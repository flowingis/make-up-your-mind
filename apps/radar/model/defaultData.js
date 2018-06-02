import { newIndexedArray } from 'radar/utils/array'

const DEFAULT_ROWS = 5

const createDefaultData = rows => {
  return newIndexedArray(rows).map(value => {
    return {
      label: `Value ${value + 1}`,
      values: {
        first: 20,
        second: 20
      }
    }
  })
}

export default createDefaultData(DEFAULT_ROWS)
