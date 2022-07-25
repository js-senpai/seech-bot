import {buildKeyboard} from "../../helpers/keyboard.js";
import moment from "moment";
import {generateTicketMessage} from "../../services/generate-ticket-message.js";

async function handleLoadMoreTicketsWithOtgClick(ctx, next) {
    const { page = 1,command = '' } = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'loadMoreTicketsWithOtg'){
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
    const [_,sale] = user.state.split('_');
    const getUsersWithOtg = await ctx.db.User.find({
        region: user?.region,
        countryState: user?.countryState,
        countryOtg: user?.countryOtg,
        userId: {
            $ne: user.userId
        },
    });
    const { docs = [], hasNextPage = false} = getUsersWithOtg.length ? await ctx.db.Ticket.paginate({
        authorId: {
            $in: getUsersWithOtg.map(({userId}) => userId)
        },
        sale
    }, { page,limit: 5,sort: { createdAt: -1 } }): { docs: [], hasNextPage: false };
    const filterTickets = docs.filter(({date}) =>  Date.now() - date <= 24 * 60 * 60 * 1000);
    if(!filterTickets.length) {
        await ctx.textTemplate(
            'input.notFoundTickets'
        )
    }
    for(let i = 0;i < filterTickets.length; i++) {
        const { text: foundText, keyboard: foundKeyboard } =
            generateTicketMessage({
                    texts: ctx.i18n,
                    ticket: filterTickets[i],
                    user: getUsersWithOtg.find(({userId}) => filterTickets[i].authorId),
                    userId: ctx.from.id
                }
            )
        if(i + 1 === filterTickets.length && hasNextPage){
            await ctx.text(foundText,{
                reply_markup: {
                    inline_keyboard: [
                        ...foundKeyboard?.reply_markup?.inline_keyboard || [],
                        ...buildKeyboard(ctx.i18n, {
                            name: 'loadMoreTicketsWithOtg',
                            data: {
                                page: page + 1
                            }
                        }).reply_markup.inline_keyboard
                    ]
                }
            })
            await user.updateData({
                state: `loadMoreTicketsWithOtg_${sale}`
            })
        } else {
            await ctx.text(foundText, foundKeyboard)
        }
    }
}

export { handleLoadMoreTicketsWithOtgClick }