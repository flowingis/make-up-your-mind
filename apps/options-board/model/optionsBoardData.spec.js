import { factory } from './optionsBoardData'

const VALID_DATA = [
  {
    label: 'I am a valid label',
    x: 200,
    y: 200
  }
]

const createDummyRealtimeClient = dummyResult => ({
  onChange: (url, cb) => cb(dummyResult),
  get: () => Promise.resolve(dummyResult),
  set: () => {}
})

describe('optionsBoardData', () => {
  test('it should return the value from the client', () => {
    const dummyResult = [
      {
        label: 'I am a dummy label',
        x: 200,
        y: 200
      }
    ]

    const dummyRealtimeClient = createDummyRealtimeClient(dummyResult)
    const optionsBoardData = factory({
      realtimeDatabaseClient: dummyRealtimeClient
    })

    return optionsBoardData.init('DUMMY_CHANNEL').then(data => {
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

    const optionsBoardData = factory({
      realtimeDatabaseClient: dummyRealtimeClient,
      initialData: defaultData
    })

    return optionsBoardData.init('DUMMY_CHANNEL').then(data => {
      expect(data).toEqual(defaultData)
    })
  })

  test('addOnChangeListener should add a listener', () => {
    let data = false

    const dummyRealtimeClient = createDummyRealtimeClient([])
    const optionsBoardData = factory({
      realtimeDatabaseClient: dummyRealtimeClient
    })

    optionsBoardData.addOnChangeListener(value => {
      data = value
    })

    return optionsBoardData.init('A_CHANNEL').then(() => {
      expect(data).toEqual([])
    })
  })

  test('unsubscribe shoudl remove change listener', () => {
    let data = false

    const dummyRealtimeClient = createDummyRealtimeClient([])
    const optionsBoardData = factory({
      realtimeDatabaseClient: dummyRealtimeClient
    })

    const unsubscribe = optionsBoardData.addOnChangeListener(value => {
      data = value
    })

    unsubscribe()

    return optionsBoardData.init('A_CHANNEL').then(() => {
      expect(data).toBeFalsy()
    })
  })

  test('reset should set the defaultData and then return that', () => {
    let data = false

    const dummyRealtimeClient = createDummyRealtimeClient()
    dummyRealtimeClient.set = (url, value) => {
      data = value
    }

    const optionsBoardData = factory({
      realtimeDatabaseClient: dummyRealtimeClient,
      initialData: VALID_DATA
    })

    const result = optionsBoardData.reset()

    expect(result).toEqual(VALID_DATA)
    expect(data).toEqual(VALID_DATA)
  })

  test('setting not valid data should throw error', () => {
    const dummyRealtimeClient = createDummyRealtimeClient()
    const optionsBoardData = factory({
      realtimeDatabaseClient: dummyRealtimeClient,
      initialData: VALID_DATA
    })

    const NOT_VALID_DATA = [undefined, {}]

    NOT_VALID_DATA.forEach(data => {
      expect(() => {
        optionsBoardData.set(data)
      }).toThrow()
    })

    expect(() => {
      optionsBoardData.set(VALID_DATA)
    }).not.toThrow()
  })
})
