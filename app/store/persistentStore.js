import configureStore from './configureStore'
import storage from 'electron-json-storage'

function getInitialState() {
  return new Promise((resolve, reject) => {
    storage.getAll((error, data) => {
      if (error) {
        reject(error)
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
      storage.set(propName, state[propName], (error) => {
        if (error) throw error
      })
    }
  })

  return store
}


export default getStore
