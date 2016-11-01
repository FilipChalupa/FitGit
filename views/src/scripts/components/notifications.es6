var Component = require('./component')
const notification = require('../utils/notification')

/**
 * Notifications component class
 */
module.exports = class Notifications extends Component {

	constructor(el, data) {
		super(el, data)

		setTimeout(() => {
			notification('Jsou k dispozici nové změny', 'od autora Jan Novák')
		})
	}
}
