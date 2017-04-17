const configureStore = require('./configureStore')
const storage = require('electron-json-storage')

const persistentStorages = [
	'projects',
	'settings',
]

function getInitialState() {
	return new Promise((resolve, reject) => {
		storage.getAll((error, data) => {
			if (error) {
				//reject(error)
				resolve({}) // @TODO
			} else {
				const states = {}
				persistentStorages.forEach((name) => {
					if (data[name]) {
						states[name] = data[name]
					}
				})
				resolve(states)
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
			if (persistentStorages.indexOf(propName) !== -1) {
				storage.set(propName, state[propName], (error) => {
					if (error) throw error
				})
			}
		}
	})

	return store
}


module.exports = getStore
