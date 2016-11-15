var asar = require('asar')
/*var Mango = require('mango-cli')
var MangoConfig = require('./node_modules/mango-cli/lib/helpers/config')*/

var MANGO_DIR= 'views'

console.log('Packing app')
/*
var mangoProject = new Mango(MANGO_DIR, (new MangoConfig(MANGO_DIR)).get())
//mangoProject.install(function() {
	mangoProject.build([], function() {
		console.log('done')
	})
//})*/

var exec = require('child_process').exec

// @TODO: better `mango install`
exec('node ../node_modules/mango-cli/bin/mango install', {cwd: MANGO_DIR}, function(error, stdout, stderr) {
	/*if (error instanceof Error) {
		throw error
	}*/
	console.log(stdout)
})

exec('node ../node_modules/mango-cli/bin/mango build', {cwd: MANGO_DIR}, function(error, stdout, stderr) {
	if (error instanceof Error) {
		throw error
	}
	console.log(stdout)
})
