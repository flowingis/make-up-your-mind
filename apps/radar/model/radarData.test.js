import { factory } from './radarData'

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
    const dummyRealtimeClient = createDummyRealtimeClient([])
    const radarData = factory(dummyRealtimeClient)

    return radarData.addRow().then(data => {
      expect(data).toEqual([
        {
          label: 'Value 1',
          values: {
            first: 20,
            second: 20
          }
        }
      ])
    })
  })

  test('removeRow should remove last row to exisent data', () => {
    const dummyRealtimeClient = createDummyRealtimeClient([
      {
        label: 'Value 1',
        values: {
          first: 20,
          second: 20
        }
      },
      {
        label: 'Value 2',
        values: {
          first: 80,
          second: 100
        }
      }
    ])
    const radarData = factory(dummyRealtimeClient)

    return radarData.removeRow().then(data => {
      expect(data).toEqual([
        {
          label: 'Value 1',
          values: {
            first: 20,
            second: 20
          }
        }
      ])
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
})
