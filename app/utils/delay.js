module.exports = (delay) => new Promise((resolve, reject) => {
	setTimeout(resolve, delay)
})
