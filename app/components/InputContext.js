const React = require('react')
const e = React.createElement
const Component = React.Component
const electron = require('electron')
const remote = electron.remote
const Menu = remote.Menu

module.exports = class InputContext extends Component {

	constructor(props) {
		super(props)
	}


	createCallback() {
		this.contextMenu = (e) => {
			e.preventDefault()
			e.stopPropagation()

			let node = e.target

			while (node) {
				if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
					this.getOptions().popup(remote.getCurrentWindow())
					break
				}
				node = node.parentNode
			}
		}
	}


	getOptions() {
		return Menu.buildFromTemplate([{
				label: 'Zpět',
				role: 'undo',
			}, {
				label: 'Znovu',
				role: 'redo',
			}, {
				type: 'separator',
			}, {
				label: 'Vyjmout',
				role: 'cut',
			}, {
				label: 'Kopírovat',
				role: 'copy',
			}, {
				label: 'Vložit',
				role: 'paste',
			}, {
				type: 'separator',
			}, {
				label: 'Vybrat vše',
				role: 'selectall',
			},
		])
	}


	add() {
		this.createCallback()
		document.body.addEventListener('contextmenu', this.contextMenu)
	}


	remove() {
		if (this.contextMenu) {
			document.body.removeEventListener('contextmenu', this.contextMenu)
		}
	}


	render() {
		this.remove()
		this.add()
		return null
	}
}
