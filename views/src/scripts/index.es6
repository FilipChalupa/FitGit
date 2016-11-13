var jQueryFallbackProvider = require('./utils/jQueryFallbackProvider')
var componentsHandler = require('./componentsHandler')

let inject = require('./utils/inject')

var onJQueryAvailable = ($) => {
	require('./plugins')
	inject('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js')
	componentsHandler({
		'shapes': require('./components/shapes'),
		'notifications': require('./components/notifications'),
	})
}

var onJQueryMissing = () => {
	console.log('jQuery dependency is missing. This page might not work correctly. Please try again later.')
}


jQueryFallbackProvider(
	`${__dirname}/node_modules/jquery/dist/jquery.min.js`,
	onJQueryAvailable,
	onJQueryMissing
)
