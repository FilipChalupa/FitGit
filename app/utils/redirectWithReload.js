const hashHistory = require('react-router').hashHistory


// Přesměruje na nové zobrazení a aktualizuje obsah
module.exports = function(route) {
	hashHistory.push('/')
	hashHistory.push(route)
}
