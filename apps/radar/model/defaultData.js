import { newIndexedArray } from 'radar/utils/array'

const DEFAULT_ROWS = 5

const SERIES = ['first', 'second']

const createDefaultData = rows => ({
  series: [...SERIES],
  dataset: newIndexedArray(rows).map(value => {
    const values = SERIES.map(() => 20)
    return {
      label: `Value ${value + 1}`,
      values
    }
  })
})

export default createDefaultData(DEFAULT_ROWS)
