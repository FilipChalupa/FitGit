const	createStore = require('redux').createStore
const	applyMiddleware = require('redux').applyMiddleware
const thunk = require('redux-thunk').default
const	hashHistory = require('react-router').hashHistory
const	routerMiddleware = require('react-router-redux').routerMiddleware
const rootReducer = require('../reducers')

const router = routerMiddleware(hashHistory)

const enhancer = applyMiddleware(thunk, router)

module.exports = function configureStore(initialState) {
	return createStore(rootReducer, initialState, enhancer)
}
