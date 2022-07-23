import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleCreateTicketClick(ctx, next) {
    const {command = ''} = JSON.parse(ctx.callbackQuery.data)
    let sale = true
    if (command !== 'createSaleTicket') {
        if (command !== 'createBuyTicket') {
            return await next()
        } else {
            sale = false
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

    await user.updateData({
        ticket: { sale }
    })
    await ctx.textTemplate(
        'responses.cancelCreateTicket',
        {},
        buildKeyboard(ctx.i18n, {
            name: 'cancelCreateTicket',
            inline: false,
            columns: 2,
        })
    )
    await ctx.textTemplate(
        'input.cultureType',
        {},
        buildKeyboard(ctx.i18n, {
            name: 'cultureType',
            columns: 2
        })
    )
}

export { handleCreateTicketClick }