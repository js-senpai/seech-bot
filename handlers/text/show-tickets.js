import { buildKeyboard } from '../../helpers/keyboard.js'
import { generateTicketMessage } from '../../services/generate-ticket-message.js'
import { notButtonClick } from '../../services/not-button-click.js'

async function handleShowTicketsClick(ctx, next) {
	let type = 'sale'
	if (notButtonClick(ctx.i18n, ctx.message.text, 'myTickets')) {
		if (notButtonClick(ctx.i18n, ctx.message.text, 'myBasket')) {
			if (notButtonClick(ctx.i18n, ctx.message.text, 'myBuyings')) {
				return await next()
			} else {
				type = 'sale-false'
			}
		} else {
			type = 'basket'
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
	let relatedUsers = {
		[ctx.from.id]: user
	}

	let query = {}
	if (type.startsWith('sale')) {
		query.authorId = ctx.from.id
		query.sale = true
		query.waitingForReview = false
	} else if (type === 'basket') {
		query._id = {
			$in: user.basket.map(ticket => ticket.id)
		}
	}
	if (type === 'sale-false') {
		query.sale = false
	}
	const tickets = await ctx.db.Ticket.find({...query,completed: false,deleted:false})
	if (!tickets.length) {
		await ctx.textTemplate('errors.ticketsNotFound')
		return
	}
	if (type === 'basket') {
		const relatedUserIds = [
			...new Set(tickets.map(ticket => ticket.authorId))
		]
		const relatedUsersList = await ctx.db.User.find({
			userId: {
				$in: relatedUserIds
			}
		})
		relatedUsers = Object.fromEntries(
			relatedUsersList.map(user => [user.userId, user])
		)
	}
	for (const ticket of tickets) {
		const getStars = ticket.sale? await ctx.db.ReviewOfSeller.aggregate([
			{
				$match: {
					sellerId: relatedUsers[ticket.authorId]._id
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
		await ctx.text(
			generateTicketMessage({
					texts: ctx.i18n,
					ticket,
				    currentUser: user,
					user: relatedUsers[ticket.authorId],
					userId: ctx.from.id,
				    ...(ticket.sale && {
						votes: await ctx.db.ReviewOfSeller.countDocuments({
							sellerId: relatedUsers[ticket.authorId]._id,
						}),
						stars
					})
				}
			).text,
			buildKeyboard(ctx.i18n, {
				name: 'myTicket',
				data: {
					photoUrl: ticket.photoUrl,
					date: ticket.date,
					id: ticket._id,
					own: ticket.authorId === ctx.from.id
				}
			})
		)
	}
}

export { handleShowTicketsClick }
