import { factory } from './radarData'

const VALID_DATA = {
  dataset: [
    {
      label: 'Value 1',
      values: [20, 20]
    }
  ],
  series: ['first', 'second']
}

const createDummyRealtimeClient = dummyResult => ({
  onChange: (url, cb) => cb(dummyResult),
  get: () => Promise.resolve(dummyResult),
  set: () => {}
})

describe('radarData', () => {
  test('it should return the value from the client', () => {
    const dummyResult = [
      {
        label: 'I am a dummy result'
      }
    ]

    const dummyRealtimeClient = createDummyRealtimeClient(dummyResult)
    const radarData = factory(dummyRealtimeClient)

    return radarData.init('DUMMY_CHANNEL').then(data => {
      expect(data).toEqual(dummyResult)
    })
  })

  test('it should return defaultData when the client return no data', () => {
    const dummyRealtimeClient = createDummyRealtimeClient()

    const defaultData = [
      {
        label: 'Ciao'
      }
    ]

    const radarData = factory(dummyRealtimeClient, defaultData)

    return radarData.init('DUMMY_CHANNEL').then(data => {
      expect(data).toEqual(defaultData)
    })
  })

  test('addRow should add a row to exisent data with a specific format', () => {
    const dummyRealtimeClient = createDummyRealtimeClient({
      series: [],
      dataset: []
    })
    const radarData = factory(dummyRealtimeClient)

    return radarData.addRow().then(data => {
      expect(data.dataset).toEqual([
        {
          label: 'Value 1',
          values: [20, 20]
        }
      ])
    })
  })

  test('removeRow should remove last row to exisent data', () => {
    const dummyRealtimeClient = createDummyRealtimeClient(VALID_DATA)
    const radarData = factory(dummyRealtimeClient)

    return radarData.removeRow().then(data => {
      expect(data.dataset).toEqual([])
    })
  })

  test('addOnChangeListener should add a listener', () => {
    let data = false

    const dummyRealtimeClient = createDummyRealtimeClient([])
    const radarData = factory(dummyRealtimeClient)

    radarData.addOnChangeListener(value => {
      data = value
    })

    return radarData.init('A_CHANNEL').then(() => {
      expect(data).toEqual([])
    })
  })

  test('unsubscribe shoudl remove change listener', () => {
    let data = false

    const dummyRealtimeClient = createDummyRealtimeClient([])
    const radarData = factory(dummyRealtimeClient)

    const unsubscribe = radarData.addOnChangeListener(value => {
      data = value
    })

    unsubscribe()

    return radarData.init('A_CHANNEL').then(() => {
      expect(data).toBeFalsy()
    })
  })

  test('reset should set the defaultData and then return that', () => {
    let data = false

    const dummyRealtimeClient = createDummyRealtimeClient()
    dummyRealtimeClient.set = (url, value) => {
      data = value
    }

    const radarData = factory(dummyRealtimeClient, VALID_DATA)

    const result = radarData.reset()

    expect(result).toEqual(VALID_DATA)
    expect(data).toEqual(VALID_DATA)
  })

  test('setting not valid data should throw error', () => {
    const dummyRealtimeClient = createDummyRealtimeClient()
    const radarData = factory(dummyRealtimeClient, VALID_DATA)

    const DATA_WITHOUT_SERIES = {
      dataset: []
    }

    const DATA_WITH_INVALID_DATASET = {
      dataset: 'a-string'
    }

    const DATA_WITHOUT_DATASET = {
      series: []
    }

    const DATA_WITH_INVALID_SERIES = {
      series: 'a-string'
    }

    const DATA_WITHOUT_VALUES = {
      series: [],
      dataset: [{}]
    }

    const DATA_WITH_INVALID_VALUES = {
      series: [],
      dataset: [
        {
          values: 'values'
        }
      ]
    }

    const NOT_VALID_DATA = [
      undefined,
      {},
      DATA_WITHOUT_DATASET,
      DATA_WITHOUT_SERIES,
      DATA_WITHOUT_VALUES,
      DATA_WITH_INVALID_VALUES,
      DATA_WITH_INVALID_SERIES,
      DATA_WITH_INVALID_DATASET
    ]

    NOT_VALID_DATA.forEach(data => {
      expect(() => {
        radarData.set(data)
      }).toThrow()
    })

    expect(() => {
      radarData.set(VALID_DATA)
    }).not.toThrow()
  })
})
