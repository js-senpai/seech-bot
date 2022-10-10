import {buildKeyboard} from "../../helpers/keyboard.js";
import {generateTicketMessage} from "../../services/generate-ticket-message.js";


async function handleGetTicketsByOtgClick(ctx, next) {
    const { command = '' } = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'announSaleCommunity' && command !== 'announBuyCommunity'){
        return await next()
    }
    const sale = command === 'announSaleCommunity';
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
    }, { page: 1,limit: 5,sort: { createdAt: -1 } }): { docs: [], hasNextPage: false };
    const filterTickets = docs.filter(({date}) =>  Date.now() - date <= 24 * 60 * 60 * 1000);
    if(!docs.length || !filterTickets.length) {
        await ctx.textTemplate(
            'input.notFoundTickets'
        )
    }
    for(let i = 0;i < docs.length; i++) {
        const checkActive = Date.now() - docs[i].date <= 24 * 60 * 60 * 1000;
        if(checkActive){
            const { text: foundText, keyboard: foundKeyboard } =
                generateTicketMessage({
                        texts: ctx.i18n,
                        ticket: docs[i],
                        currentUser: user,
                        user: getUsersWithOtg.find(({userId}) => userId === docs[i].authorId),
                        userId: ctx.from.id
                    }
                )
            if(i + 1 === docs.length && hasNextPage){
                await ctx.text(foundText,{
                    reply_markup: {
                        inline_keyboard: [
                            ...foundKeyboard?.reply_markup?.inline_keyboard || [],
                            ...buildKeyboard(ctx.i18n, {
                                name: 'loadMoreTicketsWithOtg',
                                data: {
                                    page: 2
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
}

export { handleGetTicketsByOtgClick }