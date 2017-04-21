const React = require('react')
const e = React.createElement
const Component = React.Component
const bindActionCreators = require('redux').bindActionCreators
const connect = require('react-redux').connect
const LoadingActions = require('../actions/loading')
const nodegit = require('../utils/nodegit').nodegit
const c = require('material-ui/Card')
const Card = c.Card
const CardTitle = c.CardTitle
const status = require('../utils/status')
const t = require('../utils/text')

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


	getStatusKeys(patch) {
		const keys = []

		if (patch.isAdded()) { keys.push(status.ADDED) }
		if (patch.isConflicted()) { keys.push(status.CONFLICTED) }
		if (patch.isCopied()) { keys.push(status.COPIED) }
		if (patch.isDeleted()) { keys.push(status.DELETED) }
		if (patch.isIgnored()) { keys.push(status.IGNORED) }
		if (patch.isModified()) { keys.push(status.MODIFIED) }
		if (patch.isRenamed()) { keys.push(status.RENAMED) }
		if (patch.isTypeChange()) { keys.push(status.TYPECHANGE) }
		if (patch.isUnmodified()) { keys.push(status.UNMODIFIED) }
		if (patch.isUnreadable()) { keys.push(status.UNREADABLE) }
		if (patch.isUntracked()) { keys.push(status.UNTRACKED) }

		return keys
	}


	refresh(shaA, shaB) {
		if (!shaA) {
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
				status: this.getStatusKeys(patch),
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
						const originsWithoutNumber = ['>', '<']
						const origin = String.fromCharCode(line.origin())
						const lineNumber = originsWithoutNumber.includes(origin) ? '' : ((line.newLineno() !== -1 ? line.newLineno() : line.oldLineno()) + '.')
						return {
							origin,
							content: line.content(),
							line: lineNumber,
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
			.then(() => shaB && repo.getCommit(shaB))
			.then((commit) => commit && commit.getTree())
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
					Card,
					{
						key: i,
						className: 'diff-card',
					},
					e(
						CardTitle,
						{
							title: name,
							subtitle: artifact.status.map((k) => t(this.props.settings.language, `status_${k}`)).join(', '),
						}
					),
					e(
						'div',
						{
							className: 'diff-hunks'
						},
						this.getHunks(artifact)
					)
				)
			)
		})
	}


	getHunks(artifact) {
		return artifact.hunks.map((hunk, i) => {
			return (
				e(
					'div',
					{
						key: i,
						className: 'diff-hunk',
					},
					e(
						'div',
						{
							className: 'diff-hunk-in'
						},
						hunk.map((line, l) => {
							const classes = ['diff-line']
							switch (line.origin) {
								case '+':
									classes.push('diff-line-addition')
									break
								case '-':
									classes.push('diff-line-removal')
									break
							}
							return (
								e(
									'div',
									{
										key: l,
										className: classes.join(' '),
									},
									e(
										'div',
										{
											className: 'diff-line-number',
										},
										line.line
									),
									e(
										'div',
										{
											className: 'diff-line-origin',
										},
										line.origin
									),
									e(
										'pre',
										{
											className: 'diff-line-code',
										},
										line.content
									)
								)
							)
						})
					)
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
		settings: state.settings,
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
