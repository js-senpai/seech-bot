import { buildKeyboard } from '../../helpers/keyboard.js'
import { notButtonClick } from '../../services/not-button-click.js'

async function handleTicketChooseClick(ctx, next) {
	let sale = true
	if (notButtonClick(ctx.i18n, ctx.message.text, 'sell')) {
		if (notButtonClick(ctx.i18n, ctx.message.text, 'buy')) {
			return await next()
		} else {
			sale = false
		}
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
	await user.updateData({
		ticket: { sale }
	})
	await ctx.textTemplate(
		'responses.cancelCreateTicket',
		{},
		buildKeyboard(ctx.i18n, {
			name: 'cancelCreateTicket',
			inline: false,
			columns: 2,
		})
	)
	await ctx.textTemplate(
		'input.cultureType',
		{},
		buildKeyboard(ctx.i18n, {
			name: 'cultureType',
			columns: 2
		})
	)
	// await ctx.textTemplate(
	// 	'input.chooseAction',
	// 	{},
	// 	{
	// 		parse_mode: 'HTML',
	// 		reply_markup: {
	// 			inline_keyboard: sale ? [
	// 				...buildKeyboard(ctx.i18n, {
	// 					name: 'createSaleTicket',
	// 				}).reply_markup.inline_keyboard,
	// 				...buildKeyboard(ctx.i18n, {
	// 					name: 'announBuyCommunity',
	// 				}).reply_markup.inline_keyboard,
	// 			]: [
	// 				...buildKeyboard(ctx.i18n, {
	// 					name: 'createBuyTicket',
	// 				}).reply_markup.inline_keyboard,
	// 				...buildKeyboard(ctx.i18n, {
	// 					name: 'announSaleCommunity',
	// 				}).reply_markup.inline_keyboard,
	// 			]
	// 		}
	// 	}
	// )
}

export { handleTicketChooseClick }
