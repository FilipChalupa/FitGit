const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const electron = require('electron')
const remote = electron.remote
const Menu = remote.Menu
const t = require('../utils/text')

class InputContext extends Component {

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
				label: t(this.props.settings.language, 'input_context_undo'),
				role: 'undo',
			}, {
				label: t(this.props.settings.language, 'input_context_redo'),
				role: 'redo',
			}, {
				type: 'separator',
			}, {
				label: t(this.props.settings.language, 'input_context_cut'),
				role: 'cut',
			}, {
				label: t(this.props.settings.language, 'input_context_copy'),
				role: 'copy',
			}, {
				label: t(this.props.settings.language, 'input_context_paste'),
				role: 'paste',
			}, {
				type: 'separator',
			}, {
				label: t(this.props.settings.language, 'input_context_selectall'),
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


module.exports = connect((state) => {
	return {
		settings: state.settings,
	}
}, (dispatch) => {
	return {}
})(InputContext)
