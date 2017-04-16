const combineReducers = require('redux').combineReducers
const routing = require('react-router-redux').routerReducer
//const counter = require('./counter')
const loading = require('./loading')
const integrator = require('./integrator')
const projects = require('./projects')
const settings = require('./settings')
const status = require('./status')
const menu = require('./menu')

const rootReducer = combineReducers({
	//counter,
	loading,
	integrator,
	projects,
	routing,
	settings,
	status,
	menu,
})

module.exports = rootReducer
