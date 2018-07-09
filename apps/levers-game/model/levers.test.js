import { factory } from './levers'

const createDummyRealtimeClient = dummyResult => ({
  onChange: (url, cb) => cb(dummyResult),
  get: () => Promise.resolve(dummyResult),
  set: () => {}
})

describe('levers model', () => {
  test('it should return the value from the client', () => {
    const dummyResult = [
      {
        label: 'I am a dummy result'
      }
    ]

    const dummyRealtimeClient = createDummyRealtimeClient(dummyResult)
    const levers = factory({ realtimeDatabaseClient: dummyRealtimeClient })

    return levers.init('DUMMY_CHANNEL').then(data => {
      expect(data).toEqual(dummyResult)
    })
  })

  test('it should return defaultData when the client return no data', () => {
    const dummyRealtimeClient = createDummyRealtimeClient()

    const initialData = [
      {
        label: 'Ciao'
      }
    ]

    const levers = factory({
      initialData,
      realtimeDatabaseClient: dummyRealtimeClient
    })

    return levers.init('DUMMY_CHANNEL').then(data => {
      expect(data).toEqual(initialData)
    })
  })

  test('should replace the position of the right element', () => {
    const VALUES = ['a', 'b', 'c']
    const COORDS = [{ y: 0 }, { y: 50 }, { y: 100 }]
    const dummyRealtimeClient = createDummyRealtimeClient(VALUES)
    const levers = factory({
      realtimeDatabaseClient: dummyRealtimeClient,
      coordinates: COORDS
    })

    return levers.changePosition('b', { y: 110 }).then(data => {
      expect(data).toEqual(['a', 'c', 'b'])
    })
  })
})
