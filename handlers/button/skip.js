import { finishCreatingTicket } from '../create-ticket.js'
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleSkipClick(ctx, next) {
	if (!ctx.callbackQuery.data.startsWith('skip')) {
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
	await user.updateData({ state: 'free' })
	await finishCreatingTicket(ctx, user)
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

export { handleSkipClick }
