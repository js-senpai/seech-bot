import { buildKeyboard } from '../../helpers/keyboard.js'

async function handleRegionClick(ctx, next) {
	const [command, regionId] = ctx.callbackQuery.data.split('_')
	if (!command.startsWith('region')) {
		return await next()
	}
	const user = await ctx.getUser()
	await user.updateData({
		region: regionId
	})
	await ctx.textTemplate(
		'responses.mainMenu',
		{},
		buildKeyboard(ctx.i18n, {
			name: 'mainMenu',
			inline: false,
			columns: 2,
			data: {
				userType: user.type
			}
		})
	)
}

export { handleRegionClick }
