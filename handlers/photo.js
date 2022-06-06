import { finishCreatingTicket } from './create-ticket.js'

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
}

export { handlePhoto }
