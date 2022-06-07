import { finishCreatingTicket } from '../create-ticket.js'
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleLiterInput(ctx, next) {
    const user = await ctx.getUser()
    if (user.state !== 'liter') {
        return await next()
    }
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
    const liter = ctx.message.text
    if (isNaN(liter) || liter < 10) {
        await ctx.textTemplate('errors.invalid.liter')
        return
    }
    const updateUser = await user.updateData({
        'ticket.weight': liter,
        'ticket.weightType': 'liter'
    })
    let state = 'free'
    if (updateUser.ticket?.sale) {
        await ctx.textTemplate('input.price',{
            weightValue: ctx.i18n.t(`types.volumeValue`),
            product: updateUser.ticket.culture
        })
        state = 'price'
    } else {
        await finishCreatingTicket(ctx, updateUser)
    }
    await user.updateData({ state })
}

export { handleLiterInput }
