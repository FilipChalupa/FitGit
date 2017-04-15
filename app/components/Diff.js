const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const LoadingActions = require('../actions/loading')
const nodegit = require('../utils/nodegit').nodegit

class Diff extends Component {

	constructor(props) {
		super(props)

		this.state = {
			artifacts: [],
			updating: false,
		}
	}

	setUpdating(updating) {
		this.setState(Object.assign({}, this.state, { updating }))
		if (updating) {
			this.props.actions.loading.IncrementLoadingJobs()
		} else {
			this.props.actions.loading.DecrementLoadingJobs()
		}
	}


	componentDidMount() {
		this.refresh(this.props.shaA, this.props.shaB)
	}


	componentWillReceiveProps(nextProps) {
		if (this.props.shaA !== nextProps.shaA || this.props.shaB !== nextProps.shaB) {
			this.refresh(nextProps.shaA, nextProps.shaB)
		}
	}


	refresh(shaA, shaB) {
		if (!shaA || !shaB) {
			return
		}
		this.setUpdating(true)
		let repo
		let artifacts = []
		let treeA
		let patches
		let currentPathIndex
		let hunks
		let currentHunkIndex

		const processPatch = () => {
			if (patches.length === currentPathIndex) {
				return Promise.resolve()
			}
			const patch = patches[currentPathIndex++]

			artifacts[currentPathIndex] = {
				oldName: patch.oldFile().path(), // @TODO: check why oldName = newName always
				newName: patch.newFile().path(),
				hunks: [],
			}

			return patch.hunks()
				.then((h) => {
					hunks = h
					currentHunkIndex = 0
					return processHunk()
				})
				.then(processPatch)
		}

		const processHunk = () => {
			if (hunks.length === currentHunkIndex) {
				return Promise.resolve()
			}

			const hunk = hunks[currentHunkIndex++]

			return hunk.lines()
				.then((lines) => {
					artifacts[currentPathIndex].hunks.push(lines.map((line) => {
						return {
							origin: String.fromCharCode(line.origin()),
							content: line.content(),
						}
					}))
				})
				.then(processHunk)
		}

		nodegit.Repository.open(this.props.projects.active.path)
			.then((r) => {
				repo = r
				return repo.getCommit(shaA)
			})
			.then((commit) => commit.getTree())
			.then((t) => treeA = t)
			.then(() => repo.getCommit(shaB))
			.then((commit) => commit.getTree())
			.then((t) => treeA.diff(t))
			.then((diffs) => {
				return diffs.findSimilar({
					flags: nodegit.Diff.FIND.RENAMES,
				})
					.then(() => diffs)
			})
			.then((diffs) => diffs.patches())
			.then((p) => {
				patches = p
				currentPathIndex = 0
				return processPatch()
			})
			.catch((error) => {
				console.error(error)
			})
			.then(() => {
				this.setState(Object.assign({}, this.states, { artifacts }))
				this.setUpdating(false)
			})

	}


	getArtifacts() {
		return this.state.artifacts.map((artifact, i) => {
			const name = artifact.oldName + (artifact.oldName === artifact.newName ? '' : ` > ${artifact.newName}`)
			return (
				e(
					'div',
					{
						key: i,
						style: {
							marginTop: 10,
						},
					},
					e(
						'h3',
						{
							style: {
								marginBottom: 5,
							},
						},
						name
					),
					this.getHunks(artifact)
				)
			)
		})
	}


	getBackgroundColor(origin) {
		switch (origin) {
			case '+':
				return 'rgba(0, 255, 0, 0.25)'
			case '-':
				return 'rgba(255, 0, 0, 0.25)'
			default:
				return 'rgba(0, 0, 0, 0.05)'
		}
	}


	getHunks(artifact) {
		return artifact.hunks.map((hunk, i) => {
			return (
				e(
					'div',
					{
						key: i,
						style: {
							paddingBottom: 5,
							marginBottom: 5,
							borderBottom: '1px solid gray',
						},
					},
					hunk.map((line, l) => {
						return (
							e(
								'pre',
								{
									key: l,
									style: {
										backgroundColor: this.getBackgroundColor(line.origin),
										margin: 0,
										overflow: 'auto',
									},
								},
								line.origin + line.content
							)
						)
					})
				)
			)
		})
	}


	render() {
		const renderArtifacts = () => {
			const artifacts = this.getArtifacts()
			if (artifacts.length) {
				return artifacts
			} else {
				return (
					(this.state.updating || (!this.state.shaA && !this.state.shaB)) ? null : e('div', null, 'Žádné změny nejsou k dispozici.')
				)
			}

		}

		return (
			e(
				'div',
				null,
				renderArtifacts()
			)
		)
	}

}


function mapStateToProps(state) {
	return {
		loading: state.loading,
		projects: state.projects,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			loading: bindActionCreators(LoadingActions, dispatch),
		}
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Diff)
