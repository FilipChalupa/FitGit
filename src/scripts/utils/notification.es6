module.exports = (title, message) => {
	let n = new Notification(title, {
		body: message
	})

	n.onclick = () => {
		location.replace('updates.html')
	}
}
