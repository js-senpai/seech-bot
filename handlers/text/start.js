import { buildKeyboard } from '../../helpers/keyboard.js'

async function handleStartCommand(ctx) {
	const user = await ctx.getUser()
	if (user.personalDataProcessing) {
		await ctx.textTemplate(
			'responses.greeting',
			{ name: user.name || ctx.from.first_name },
			buildKeyboard(ctx.i18n, {
				name: 'mainMenu',
				inline: false,
				columns: 2,
				data: {
					userType: user.type
				}
			})
		)
		await user.updateData({
			state: 'free',
			ticket: {}
		})
	} else {
		await ctx.textTemplate(
			'input.personalDataProcessing',
			{},
			buildKeyboard(ctx.i18n, {
				name: 'personalDataProcessing',
				columns: 2
			})
		)
	}
}

export { handleStartCommand }
