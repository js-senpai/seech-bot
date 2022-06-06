import { createTicket } from '../services/create-ticket.js'
import { findRelatedTickets } from '../services/database/find-related-tickets.js'
import { generateTicketMessage } from '../services/generate-ticket-message.js'
import { sendMessage } from '../services/send-message.js'

async function finishCreatingTicket(ctx, user) {
	const ticket = await createTicket(ctx.db.Ticket, user, ctx)
	const tickets = await findRelatedTickets(ctx.db.Ticket, ticket, user.region)
	if (!tickets.length) {
		await ctx.textTemplate(
			`errors.${ticket.sale ? 'buyersNotFound' : 'sellersNotFound'}`
		)
		return
	}
	const getStars = ticket.sale? await ctx.db.ReviewOfSeller.aggregate([
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
			ticket,
			user,
			userId: null,
			votes: await ctx.db.ReviewOfSeller.countDocuments({
				sellerId: user._id,
			}),
		    stars
		}
	)
	const relatedUserIds = tickets.map(ticket => ticket.authorId)
	const relatedUsersList = await ctx.db.User.find({
		userId: {
			$in: relatedUserIds
		}
	})
	const relatedUsers = Object.fromEntries(
		relatedUsersList.map(user => [user.userId, user])
	)
	for (const ticket of tickets) {
		const { text: foundText, keyboard: foundKeyboard } =
			generateTicketMessage({
					texts: ctx.i18n,
					ticket,
					user: relatedUsers[ticket.authorId],
					userId: ctx.from.id
				}
			)

		await ctx.text(foundText, foundKeyboard)
	}
	const uniqueRelatedUserIds = new Set(relatedUserIds)
	for (const userId of uniqueRelatedUserIds) {
		await sendMessage.bind(ctx)(text, Object.assign(keyboard, { userId }))
	}
}

export { finishCreatingTicket }
