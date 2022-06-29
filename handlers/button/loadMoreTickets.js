import {buildKeyboard} from "../../helpers/keyboard.js";
import {generateTicketMessage} from "../../services/generate-ticket-message.js";
import {findRelatedTickets} from "../../services/database/find-related-tickets.js";

async function handleLoadMoreTicketsClick(ctx, next) {
    const { command = '',page = 1 } = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'loadMoreTickets'){
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
    const [_,ticketId] = user.state.split('_');
    const ticket = await ctx.db.Ticket.findOne({
       _id: ticketId
    })
    const tickets = await findRelatedTickets(ctx.db.Ticket, ticket, user.region)
    if (!tickets.length) {
        await ctx.textTemplate(
            `errors.${ticket.sale ? 'buyersNotFound' : 'sellersNotFound'}`
        )
        return
    }
    const relatedUserIds = tickets.filter(({date}) => Date.now() - date <= 24 * 60 * 60 * 1000).map(ticket => ticket.authorId)
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
    const { docs = [], hasNextPage = false} = await ctx.db.Ticket.aggregatePaginate(aggregation, { page,limit: 5 });
    for(let i = 0;i < docs.length; i++) {
        const { text: foundText, keyboard: foundKeyboard } =
            generateTicketMessage({
                    texts: ctx.i18n,
                    ticket: docs[i],
                    user: relatedUsers[ticket.authorId],
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
                                page: page + 1
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

export { handleLoadMoreTicketsClick }