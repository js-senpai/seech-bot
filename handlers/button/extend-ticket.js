import { buildKeyboard } from '../../helpers/keyboard.js'

async function handleExtendTicketClick(ctx, next) {
	const [command, ticketId] = ctx.callbackQuery.data.split('_')
	if (!command.startsWith('extend')) {
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
	const ticket = await ctx.db.Ticket.getOne(ticketId)
	if (!ticket || ticket.authorId !== ctx.from.id) {
		await ctx.popupTemplate('errors.ticketNotFound')
		return
	} else {
		await ticket.updateData({
			date: new Date()
		})
		await ctx.popupTemplate('responses.extended')
	}
	await ctx.editMessageReplyMarkup(
		buildKeyboard(ctx.i18n, {
			name: 'myTicket',
			data: {
				date: Date.now(),
				photo: ticket.photo,
				id: ticketId
			}
		}).reply_markup
	)
}

export { handleExtendTicketClick }
