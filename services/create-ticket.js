import { buildKeyboard } from '../helpers/keyboard.js'
import { generateTicketMessage } from './generate-ticket-message.js'
import { schedule } from './schedule.js'

async function createTicket(Ticket, user, ctx) {
	const ticketData = Object.assign(user.ticket._doc, {})
	Reflect.deleteProperty(ticketData, '_id')
	ticketData.authorId = user.userId
	ticketData.date = new Date()
	const ticket = await Ticket.create(ticketData)
	schedule(24 * 60, async () => {
		const { modifiedCount } = await ticket.updateOne({
			active: false
		})
		if (modifiedCount) {
			await ctx.textTemplate('responses.extend')
			await ctx.text(
				generateTicketMessage(
					{
						texts: ctx.i18n,
						ticket,
						currentUser: user,
						user,
						userId: user.userId,
					}
				).text,
				buildKeyboard(ctx.i18n, {
					name: 'myTicket',
					data: {
						photo: ticket.photo,
						date: ticket.date,
						id: ticket._id,
						own: true
					}
				})
			)
		}
	})
	await user.updateData({ ticket: {} })
	return ticket
}

export { createTicket }
