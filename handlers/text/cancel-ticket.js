import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleCancelTicketCommand(ctx, next) {
    let user = await ctx.getUser()
    if (notButtonClick(ctx.i18n, ctx.message.text, 'cancelCreateTicket')) {
        return await next()
    }
    await user.updateData({
        state: '',
        ticket: {}
    })
    await ctx.textTemplate(
        'responses.mainMenu',
        {},
        buildKeyboard(ctx.i18n, {
            name: 'mainMenu',
            inline: false,
            columns: 2,
            data: {
                userType: user.type
            }
        })
    )
}

export { handleCancelTicketCommand }