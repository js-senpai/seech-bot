import {buildKeyboard} from "../../helpers/keyboard.js";
import {finishCreatingTicket} from "../create-ticket.js";

async function handleCreateTicketFromAppClick(ctx, next) {
    const user = await ctx.getUser()
    const {command = ''} = JSON.parse(ctx.callbackQuery.data)
    const [name, id] = user.state.split('_');
    if (name !== 'createTicketFromApp' && command !== 'createTicketFromApp') {
        return await next()
    }
    if (!user || !user.phone) {
        return await ctx.textTemplate(
            'input.personalDataProcessing',
            {},
            buildKeyboard(ctx.i18n, {
                name: 'personalDataProcessing',
                columns: 2
            })
        )
    }
    const ticket = await ctx.db.Ticket.findById(id)
    console.log(id,ticket)
    if(ticket){
        await finishCreatingTicket(ctx, user,ticket)
    }
    await user.updateData({ state: '' })
}

export { handleCreateTicketFromAppClick }