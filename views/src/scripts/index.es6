var jQueryFallbackProvider = require('./utils/jQueryFallbackProvider')
var componentsHandler = require('./componentsHandler')

var onJQueryAvailable = ($) => {
	require('./plugins')
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
