import { buildKeyboard } from '../../helpers/keyboard.js'
import { schedule } from '../../services/schedule.js'

async function handleAddToBasketClick(ctx, next) {
	const [command, ticketId] = ctx.callbackQuery.data.split('_')
	if (!command.startsWith('toBasket')) {
		return await next()
	}
	const checkUser = await ctx.getUser()
	if(!checkUser && !checkUser.phone){
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
	if (!ticket) {
		await ctx.popupTemplate('errors.ticketNotFound')
	} else {
		// await ticket.updateData({
		// 	active: false
		// })
		const user = await ctx.getUser()
		await user.updateData({
			$addToSet: {
				basket: {
					id: ticketId,
					date: new Date()
				}
			}
		})
		// schedule(15, async () => {
		// 	await ticket.updateData({
		// 		active: true
		// 	})
		// })
		await ctx.popupTemplate('responses.addedToBasket')
	}
	const alreadyPhoto = !!ctx.callbackQuery.message.photo
	await ctx.editMessageReplyMarkup(
		buildKeyboard(ctx.i18n, {
			name: 'ticketActions',
			data: {
				photo: alreadyPhoto ? null : ticket.photo,
				sale: ticket.sale,
				basket: false,
				id: ticketId
			}
		}).reply_markup
	)
}

export { handleAddToBasketClick }
