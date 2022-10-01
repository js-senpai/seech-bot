import { buildKeyboard } from '../../helpers/keyboard.js'

async function handleShowPhotoClick(ctx, next) {
	const [command, ticketId] = ctx.callbackQuery.data.split('_')
	if (!command.startsWith('showPhoto')) {
		return await next()
	}
	const checkUser = await ctx.getUser()
	if(!checkUser || !checkUser.phone){
		return await ctx.textTemplate(
			'input.personalDataProcessing',
			{},
			buildKeyboard(ctx.i18n, {
				name: 'personalDataProcessing',
				columns: 2
			})
		)
	}
	const ticket = await ctx.db.Ticket.getOne(ticketId)
	if (!ticket?.photo) {
		await ctx.popupTemplate('errors.ticketNotFound')
	} else {
		let keyboard
		const user = await ctx.getUser()
		const own = ticket.authorId === ctx.from.id
		const basket = user.basket.some(ticket => ticket.id === ticketId)
		if (own || basket) {
			keyboard = buildKeyboard(ctx.i18n, {
				name: 'myTicket',
				data: {
					photo: null,
					date: ticket.date,
					id: ticketId,
					own
				}
			})
		} else {
			keyboard = buildKeyboard(ctx.i18n, {
				name: 'ticketActions',
				data: {
					photo: null,
					basket: !basket,
					id: ticketId,
					sale: ticket.sale
				}
			})
		}
		await ctx.replyWithPhoto(ticket.photoUrl, {
			reply_to_message_id: ctx.update.callback_query.message.message_id,
			...keyboard
		})
	}
	await ctx.editMessageReplyMarkup({})
}

export { handleShowPhotoClick }
