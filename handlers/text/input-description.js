import { buildKeyboard } from '../../helpers/keyboard.js'

async function handleDescriptionInput(ctx, next) {
	const user = await ctx.getUser()
	if (user.state !== 'description') {
		return await next()
	}
	if(!user || !user.phone){
		return await ctx.textTemplate(
			'input.personalDataProcessing',
			{},
			buildKeyboard(ctx.i18n, {
				name: 'personalDataProcessing',
				columns: 2
			})
		)
	}
	await ctx.textTemplate(
		'input.photo',
		{},
		buildKeyboard(ctx.i18n, {
			name: 'skip'
		})
	)
	await user.updateData({
		'ticket.description': ctx.message.text,
		state: 'photo'
	})
}

export { handleDescriptionInput }
