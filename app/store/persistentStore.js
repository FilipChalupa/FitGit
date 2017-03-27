import configureStore from './configureStore'
import storage from 'electron-json-storage'

const shortLivedStorages = [
  'loading',
  'integrator',
  'routing',
  'status',
]

function getInitialState() {
  return new Promise((resolve, reject) => {
    storage.getAll((error, data) => {
      if (error) {
        //reject(error)
        resolve({}) // @TODO
      } else {
        resolve(data)
      }
    })
  })
}

async function getStore() {
  const initialState = await getInitialState()

  const store = configureStore(initialState)

  store.subscribe(() => {
    const state = store.getState()

    // @TODO: update only changed props
    for (const propName in state) {
      if (shortLivedStorages.indexOf(propName) === -1) {
        storage.set(propName, state[propName], (error) => {
          if (error) throw error
        })
      }
    }
  })

  return store
}


export default getStore
