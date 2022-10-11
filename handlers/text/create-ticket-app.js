import {buildKeyboard} from "../../helpers/keyboard.js";
import {finishCreatingTicket} from "../create-ticket.js";

async function handleCreateTicketFromAppInput(ctx, next) {
    const user = await ctx.getUser()
    const [name, id] = user.state.split('_');
    if (name !== 'createTicketFromApp') {
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
    if(ticket){
        await finishCreatingTicket(ctx, user,ticket)
    }
    await user.updateData({ state: '' })
}

export { handleCreateTicketFromAppInput }