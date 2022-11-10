import {buildKeyboard} from "../../helpers/keyboard.js";
import {notButtonClick} from "../../services/not-button-click.js";

async function handleMyRequestsCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'myTickets')) {
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
    await ctx.textTemplate(
        'responses.choose',
        {},
        buildKeyboard(ctx.i18n, {
            name: 'myRequestsMenu',
            inline: false,
            columns: 2
        })
    )
}

export { handleMyRequestsCommand }
