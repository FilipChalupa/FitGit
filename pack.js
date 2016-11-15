console.log('Packing app')

var exec = require('child_process').exec

var start = function() {
	installMangoDependencies()
}

// @TODO: better `mango install`
var installMangoDependencies = function() {
	exec('node node_modules/mango-cli/bin/mango install', function(error, stdout, stderr) {
		console.log(stdout)
		buildMango()
	})
}

var buildMango = function() {
	exec('node node_modules/mango-cli/bin/mango build', function(error, stdout, stderr) {
		if (error instanceof Error) {
			throw error
		}
		console.log(stdout)
		createPackage()
	})
}

var createPackage = function() {
	exec('npm run dist', function(error, stdout, stderr) {
		if (error instanceof Error) {
			throw error
		}
		console.log(stdout)
	})
}

start()
