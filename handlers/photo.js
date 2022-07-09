import { finishCreatingTicket } from './create-ticket.js'
import {buildKeyboard} from "../helpers/keyboard.js";

async function handlePhoto(ctx, next) {
	let user = await ctx.getUser()
	if (user.state !== 'photo') {
		return await next()
	}
	user = await user.updateData({
		state: 'free',
		'ticket.photo': ctx.message.photo[0].file_id
	})
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

export { handlePhoto }
