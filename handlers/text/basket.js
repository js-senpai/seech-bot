import { buildKeyboard } from '../../helpers/keyboard.js'
import { notButtonClick } from '../../services/not-button-click.js'

async function handleBasketCommand(ctx, next) {
	if (notButtonClick(ctx.i18n, ctx.message.text, 'basket')) {
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
	await ctx.textTemplate(
		'responses.choose',
		{},
		buildKeyboard(ctx.i18n, {
			name: 'basketMenu',
			inline: false,
			columns: 2
		})
	)
}

export { handleBasketCommand }
