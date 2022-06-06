import { buildKeyboard } from '../helpers/keyboard.js'

async function handleContact(ctx) {
	const user = await ctx.getUser()
	const lastName = ` ${ctx.message.contact.last_name || ''}`
	await user.updateData({
		phone: ctx.message.contact.phone_number,
		name: `${ctx.message.contact.first_name}${lastName}`.trim()
	})
	await ctx.textTemplate(
		'input.regions',
		{},
		buildKeyboard(ctx.i18n, {
			name: 'regions',
			columns: 3
		})
	)
	await user.updateData({
		state: 'free'
	})
}

export { handleContact }
