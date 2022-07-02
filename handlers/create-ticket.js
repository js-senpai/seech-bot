import { createTicket } from '../services/create-ticket.js'
import { findRelatedTickets } from '../services/database/find-related-tickets.js'
import { generateTicketMessage } from '../services/generate-ticket-message.js'
import { sendMessage } from '../services/send-message.js'
import moment from "moment";
import {buildKeyboard} from "../helpers/keyboard.js";

async function finishCreatingTicket(ctx, user) {
	const ticket = await createTicket(ctx.db.Ticket, user, ctx)
	const tickets = await findRelatedTickets(ctx.db.Ticket, ticket, user.region)
	if(ticket.sale){
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
		const getUsersWithOtg = await ctx.db.User.find({
			region: user?.region,
			countryState: user?.countryState,
			countryOtg: user?.countryOtg,
			userId: {
				$ne: user.userId
			}
		})
		for(const { userId } of getUsersWithOtg){
			await sendMessage.bind(ctx)(text, Object.assign(keyboard, { userId }))
		}
	}
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
	const relatedUserIds = tickets.filter(({date}) => Date.now() - date <= 24 * 60 * 60 * 1000).map(ticket => ticket.active && ticket.authorId)
	const relatedUsersList = await ctx.db.User.find({
		userId: {
			$in: relatedUserIds
		}
	})
	const relatedUsers = Object.fromEntries(
		relatedUsersList.map(user => [user.userId, user])
	)
	const region = user.region
	const aggregation = ctx.db.Ticket.aggregate([
		{
			// Search for customers in case of sale and vice versa
			$match: {
				culture: ticket.culture,
				sale: !ticket.sale,
				active: true,
				waitingForReview: false,
				authorId: {
					$ne: ticket.authorId
				}
			}
		},
		{
			$addFields: {
				// Calculate weight suitability
				weightScore: {
					$cond: {
						if: {
							[ticket.sale ? '$gte' : '$lte']: ['$weight', ticket.weight]
						},
						then: 1, // Same score for all suitable
						else: {
							$subtract: ['$weight', ticket.weight]
						}
					}
				},
				// Calculate region suitability
				regionScore: {
					$cond: {
						if: {region},
						then: 1,
						else: 0
					}
				}
			}
		},
		{
			// Sort to get results in expected priorities
			$sort: {
				weightScore: -1,
				date: -1,
				region: -1
			}
		},
	])
	const { docs = [], hasNextPage = false} = await ctx.db.Ticket.aggregatePaginate(aggregation, { page: 1,limit: 5 });
	for(let i = 0;i < docs.length; i++) {
		const { text: foundText, keyboard: foundKeyboard } =
			generateTicketMessage({
					texts: ctx.i18n,
					ticket: docs[i],
					user: relatedUsers[ticket.authorId],
					userId: ctx.from.id
				}
			)
		if(docs[i].active){
			if(i + 1 === docs.length && hasNextPage){
				await ctx.text(foundText,{
					reply_markup: {
						inline_keyboard: [
							...foundKeyboard?.reply_markup?.inline_keyboard || [],
							...buildKeyboard(ctx.i18n, {
								name: 'loadMoreTickets',
								data: {
									page: 2
								}
							}).reply_markup.inline_keyboard
						]
					}
				})
				await user.updateData({
					state: `loadMoreTickets_${ticket._id}`
				})
			} else {
				await ctx.text(foundText, foundKeyboard)
			}
		}
	}
	const uniqueRelatedUserIds = new Set(relatedUserIds)
	for (const userId of uniqueRelatedUserIds) {
		await sendMessage.bind(ctx)(text, Object.assign(keyboard, { userId }))
	}

}

export { finishCreatingTicket }
