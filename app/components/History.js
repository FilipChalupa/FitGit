const React = require('react')
const e = React.createElement
const Component = React.Component

module.exports = class History extends Component {

	renderTree() {
		const tree = [
			'local',
			'local',
			'remote',
			'local',
			'remote',
			'common',
			'common',
		]

		let lineRemote = false
		let lineLocal = false

		return (
			e(
				'div',
				{
					className: 'history-tree',
				},
				tree.map((node, i) => {
					const lineClasses = ['history-line']
					if (node === 'common') {
						lineClasses.push('history-line-common')
					} else {
						if (node === 'local') {
							lineLocal = true
						} else if (node === 'remote') {
							lineRemote = true
						}
						if (lineRemote) {
							lineClasses.push('history-line-remote')
						}
						if (lineLocal) {
							lineClasses.push('history-line-local')
							if (tree[i+1] && tree[i+1] === 'common') {
								lineClasses.push('history-line-merge')
							}
						}
					}
					if (i === tree.length-1) {
						lineClasses.push('history-line-last')
					}
					return e(
						'div',
						{
							key: i,
							className: `history-node history-node-${node}`,
						},
						e(
							'div',
							{
								className: lineClasses.join(' '),
							},
							e(
								'span',
								{
									className: 'history-line-in',
								}
							)
						),
						e(
							'div',
							{
								className: 'history-node-in',
							},
							node
						)
					)
				})
			)
		)
	}

	render() {
		return (
			e(
				'div',
				null,
				e('h1', null, 'Historie'),
				this.renderTree()
			)
		)
	}

}
