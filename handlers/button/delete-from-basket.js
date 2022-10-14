import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleDeleteFromBasketClick(ctx, next) {
    const [command, ticketId] = ctx.callbackQuery.data.split('_')
    if (!command.startsWith('deleteFromBasket')) {
        return await next()
    }
    const checkUser = await ctx.getUser()
    if(!checkUser && !checkUser.phone){
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
    if (!ticket) {
        await ctx.popupTemplate('errors.ticketNotFound')
    } else {
        // await ticket.updateData({
        // 	active: false
        // })
        const user = await ctx.getUser()
        await user.updateOne(
            {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _id: user._id,
            },
            {
                $pull: {
                    basket: {
                        id: ticketId,
                    },
                },
            },
        );
        await ctx.popupTemplate('responses.removedFromBasket')
    }
    await ctx.editMessageReplyMarkup(
        buildKeyboard(ctx.i18n, {
            name: 'ticketActions',
            data: {
                photo: ticket?.photoUrl,
                sale: ticket.sale,
                basket: false,
                id: ticketId
            }
        }).reply_markup
    )
}

export { handleDeleteFromBasketClick }