import {buildKeyboard} from "../../helpers/keyboard.js";
import {generateTicketMessage} from "../../services/generate-ticket-message.js";
import {findRelatedTickets} from "../../services/database/find-related-tickets.js";
import fs from "fs";
import {join, resolve} from "path";

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
    if (!tickets.length || !tickets.filter(({date}) =>  Date.now() - date <= 24 * 60 * 60 * 1000).length) {
        await ctx.textTemplate(
            `errors.${ticket.sale ? 'buyersNotFound' : 'sellersNotFound'}`
        )
        return
    }
    const getLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseLocales = JSON.parse(getLocales)
    const getRegions = await fs.promises.readFile(join(resolve(),'assets','json','region.json'),{ encoding: 'utf8' });
    const parseRegions = JSON.parse(getRegions);
    const findTicketRegion = parseRegions.find(({regionName}) => regionName === parseLocales.buttons.regions[user.region].name)
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
            item.region = parseLocales.buttons.regions[getUser.region].name
        }
    }
    const filteredTickets = getTicketRegions.length ? getTicketRegions.flatMap((name) => tickets.filter(({region}) => region === name)): tickets;
    const relatedUserIds = filteredTickets.filter(({date}) => Date.now() - date <= 24 * 60 * 60 * 1000).map(ticket => ticket.authorId)
    const relatedUsersList = await ctx.db.User.find({
        userId: {
            $in: relatedUserIds
        }
    })
    const relatedUsers = Object.fromEntries(
        relatedUsersList.map(user => [user.userId, user])
    )
    const getFilteredTicketIds = filteredTickets.map(({_id}) => _id);
    const aggregate = ctx.db.Ticket.aggregate([
        {
            $match: {
                _id: { $in: getFilteredTicketIds }
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
    const { docs = [], hasNextPage = false} = await ctx.db.Ticket.aggregatePaginate(aggregate, { page,limit: 5 });
    for(let i = 0;i < docs.length; i++) {
        const isActive = Date.now() - docs[i].date <= 24 * 60 * 60 * 1000
        if(isActive){
            const { text: foundText, keyboard: foundKeyboard } =
                generateTicketMessage({
                        texts: ctx.i18n,
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
}

export { handleLoadMoreTicketsClick }