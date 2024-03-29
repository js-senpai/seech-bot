import { buildKeyboard } from '../../helpers/keyboard.js'
import {generateTicketMessage} from "../../services/generate-ticket-message.js";
import {sendMessage} from "../../services/send-message.js";

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
			date: new Date(),
			active: true,
			numberOfExtends: ticket.numberOfExtends + 1
		})
		await ctx.popupTemplate('responses.extended')
	}
	const getTicket = await ctx.db.Ticket.getOne(ticketId)
	if(getTicket.sale){
		const getStars = getTicket.sale? await ctx.db.ReviewOfSeller.aggregate([
			{
				$match: {
					sellerId: user._id
				}
			},
			{
				$group: {
					"_id":"sellerId",
					stars: { $avg: "$value" }
				}
			}
		]): [];
		const { stars = 0 } = getStars.length? getStars[0]: { stars: 0 };
		const { text, keyboard } = generateTicketMessage({
				texts: ctx.i18n,
				ticket: getTicket,
				user,
				userId: null,
				votes: await ctx.db.ReviewOfSeller.countDocuments({
					sellerId: user._id,
				}),
				stars
			}
		)
		const getUsersWithOtg = await ctx.db.User.find({
			region: user?.region,
			countryState: user?.countryState,
			countryOtg: user?.countryOtg,
			userId: {
				$ne: user.userId
			}
		})
		for(const { userId } of getUsersWithOtg){
			setTimeout(async () => {
				await sendMessage.bind(ctx)(text,  Object.assign(keyboard, { userId }))
			},1000)

		}
	} else {
		const { text, keyboard } = generateTicketMessage({
				texts: ctx.i18n,
				ticket: getTicket,
				user,
				userId: null,
			}
		)
		const getUsersWithOtg = await ctx.db.User.find({
			region: user?.region,
			countryState: user?.countryState,
			countryOtg: user?.countryOtg,
			userId: {
				$ne: user.userId
			}
		})
		for(const { userId } of getUsersWithOtg){
			setTimeout(async () => {
				await sendMessage.bind(ctx)(text, Object.assign(keyboard, { userId }))
			},1000)
		}
	}
	await ctx.editMessageReplyMarkup(
		buildKeyboard(ctx.i18n, {
			name: 'myTicket',
			data: {
				date: Date.now(),
				photoUrl: ticket.photoUrl,
				id: ticketId
			}
		}).reply_markup
	)
}

export { handleExtendTicketClick }
