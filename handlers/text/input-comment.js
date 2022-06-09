import { buildKeyboard } from '../../helpers/keyboard.js'
import {finishCreatingTicket} from "../create-ticket.js";

async function handleCommentInput(ctx, next) {
    const user = await ctx.getUser()
    if (user.state !== 'comment') {
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
    const updateUser = await user.updateData({
        'ticket.description': ctx.message.text,
        state: ''
    })
    await finishCreatingTicket(ctx, updateUser)
}

export { handleCommentInput }
