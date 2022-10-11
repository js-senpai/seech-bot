import { createTicket } from '../services/create-ticket.js'
import { findRelatedTickets } from '../services/database/find-related-tickets.js'
import { generateTicketMessage } from '../services/generate-ticket-message.js'
import { sendMessage } from '../services/send-message.js'
import {buildKeyboard} from "../helpers/keyboard.js";
import * as fs from "fs";
import {join, resolve} from "path";

async function finishCreatingTicket(ctx, user,newTicket = null) {
	const ticket = newTicket || await createTicket(ctx.db.Ticket, user, ctx)
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
			    currentUser: user,
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
			},
			...(ticket.sale ? {
				disableBuyNotification: false
			}:{
				disablePurchaseNotification: false
			})
		})
		for(const { userId } of getUsersWithOtg){
			setTimeout(async () => {
				await sendMessage.bind(ctx)(text, Object.assign(keyboard, { userId }))
			},1000)

		}
	} else {
		const { text, keyboard } = generateTicketMessage({
				texts: ctx.i18n,
				ticket,
				user,
				userId: null,
			    currentUser: user,
			}
		)
		const getUsersWithOtg = await ctx.db.User.find({
			region: user?.region,
			countryState: user?.countryState,
			countryOtg: user?.countryOtg,
			userId: {
				$ne: user.userId
			},
			...(ticket.sale ? {
				disableBuyNotification: false
			}:{
				disablePurchaseNotification: false
			})
		})
		for(const { userId } of getUsersWithOtg){
			setTimeout(async () => {
				await sendMessage.bind(ctx)(text, Object.assign(keyboard, { userId }))
			},1000)
		}
	}
	if (!tickets.length || !tickets.filter(({date}) =>  Date.now() - date <= 24 * 60 * 60 * 1000).length) {
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
		    currentUser: user,
			user,
			userId: null,
			votes: await ctx.db.ReviewOfSeller.countDocuments({
				sellerId: user._id,
			}),
		    stars
		}
	)
	const getLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
	const parseLocales = JSON.parse(getLocales)
	const getRegions = await fs.promises.readFile(join(resolve(),'assets','json','region.json'),{ encoding: 'utf8' });
	const parseRegions = JSON.parse(getRegions);
	const findTicketRegion = parseRegions.find(({regionName}) => regionName === parseLocales.buttons.regions[user.region]?.name)
	const sortTicketRegions = findTicketRegion ? Object.entries(findTicketRegion).filter((item) => item[0] !== 'regionName')
		.sort(([,a],[,b]) => a-b)
		.reduce((r, [k, v]) => ({ ...r, [k]: v }), {}) :null
	const getTicketRegions = sortTicketRegions ? Object.keys(sortTicketRegions) : []
	for(const item of tickets){
		const { authorId } = item;
		const getUser = await ctx.db.User.findOne({
			userId: authorId
		})
		if(getUser){
			const getRegion = parseLocales.buttons.regions[getUser.region]?.name
			if(getRegion){
				item.region = getRegion
			}
		}
	}
	const filteredTickets = getTicketRegions.flatMap((name) => tickets.filter(({region}) => region === name).filter(({date}) => Date.now() - date <= 24 * 60 * 60 * 1000));
	const relatedUserIds = filteredTickets.filter(({date}) => Date.now() - date <= 24 * 60 * 60 * 1000).map(ticket => ticket.authorId)
	const relatedUsersList = await ctx.db.User.find({
		userId: {
			$in: relatedUserIds
		},
	})
	const relatedUsers = Object.fromEntries(
		relatedUsersList.map(user => [user.userId, user])
	)
	const getFilteredTicketIds = filteredTickets.map(({_id}) => _id);
	const aggregate = ctx.db.Ticket.aggregate([
		{
			$match: {
				_id: { $in: getFilteredTicketIds },
				completed: false,
				deleted: false
			}
		},
		{
			$addFields: {
				"__order":{
					$indexOfArray : [ getFilteredTicketIds, "$_id" ]
				}
			}
		},
		{
			$sort: {
				"__order": 1
			}
		}
	])
	const { docs = [], hasNextPage = false} = await ctx.db.Ticket.aggregatePaginate(aggregate, { page: 1,limit: 5 });
	for(let i = 0;i < docs.length; i++) {
		const { text: foundText, keyboard: foundKeyboard } =
			generateTicketMessage({
					texts: ctx.i18n,
				    currentUser: user,
					ticket: docs[i],
					user: relatedUsers[docs[i].authorId],
					userId: ctx.from.id
				}
			)
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
	const uniqueRelatedUserIds = new Set(relatedUserIds);
	const getUsers = await ctx.db.User.find({
		userId: {
			$in: [...uniqueRelatedUserIds]
		},
		...(ticket.sale ? {
			disablePurchaseNotification: false
		}:{
			disableBuyNotification: false
		})
	});
	for (const { userId } of getUsers) {
		setTimeout(async () => {
			await sendMessage.bind(ctx)(text, Object.assign(keyboard, { userId }))
		},1000);
	}

}

export { finishCreatingTicket }
