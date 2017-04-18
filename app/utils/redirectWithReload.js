const hashHistory = require('react-router').hashHistory

module.exports = function(route) {
	hashHistory.push('/')
	hashHistory.push(route)
}
