import { factory } from './optionsBoardData'

const VALID_DATA = {}

const createDummyRealtimeClient = dummyResult => ({
  onChange: (url, cb) => cb(dummyResult),
  get: () => Promise.resolve(dummyResult),
  set: () => {}
})

describe('optionsBoardData', () => {
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

    const NOT_VALID_DATA = [undefined]

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
