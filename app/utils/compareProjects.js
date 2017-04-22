module.exports = function compareProjects(a, b) {
	if (a && b) {
		return a.key === b.key
	} else {
		return false
	}
}
