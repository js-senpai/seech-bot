import { buildKeyboard } from '../../helpers/keyboard.js'

async function handleCultureTypeClick(ctx, next) {
	const [command, type] = ctx.callbackQuery.data.split('_')
	if (!command.startsWith('cultureType')) {
		return await next()
	}
	const user = await ctx.getUser()
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
	await ctx.editMessageReplyMarkup(
		buildKeyboard(ctx.i18n, {
			name: type,
			columns: 2
		}).reply_markup
	)
}

export { handleCultureTypeClick }
