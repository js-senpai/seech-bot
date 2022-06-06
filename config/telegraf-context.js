import Telegraf from 'telegraf'

import { showPopup } from '../services/show-popup.js'
import { sendMessage } from '../services/send-message.js'

class ExtendedContext extends Telegraf.Context {
	constructor(update, telegram, options) {
		super(update, telegram, options)
		this.user = null
	}

	popup = showPopup

	text = sendMessage

	textTemplate(label, data = {}, extra) {
		const text = this.i18n.t(label, data)
		return this.text(text, extra)
	}

	popupTemplate(label, data = {}) {
		const text = this.i18n.t(label, data)
		return this.popup(text)
	}

	async getUser() {
		if (!this.user) {
			this.user = await this.db.User.getOne(
				this.from.id,
				// this.from.first_name
			)
		}
		return this.user
	}
}

export { ExtendedContext }
