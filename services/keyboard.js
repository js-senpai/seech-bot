import Markup from 'telegraf/markup.js'

function inlineKeyboard(texts, buttons, columns) {
	return Markup.inlineKeyboard(
		buttons.map(button => {
			const [labelTemplate, data, labelData, isUrl] = button
			const method = isUrl ? 'urlButton' : 'callbackButton'
			const markup = Markup[method]
			const label = texts.t(`buttons.${labelTemplate}`, labelData || {})
			return markup(label, data)
		}),
		{ columns }
	).extra()
}

function keyboard(texts, buttons, columns, contact) {
	const type = contact ? 'contactRequestButton' : 'button'
	// prettier-ignore
	return Markup
		.keyboard(
			buttons.filter(item => item.length).map(
				button => Markup[type](texts.t(`buttons.${button}`))
			),
			{ columns }
		)
		.resize()
		.extra()
}

export { keyboard, inlineKeyboard }
