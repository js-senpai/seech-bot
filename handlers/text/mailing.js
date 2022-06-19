import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleMailingCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'mailing')) {
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
    if(user.type === 'user') {
        return await next()
    }
    await ctx.textTemplate(await ctx.i18n.t('input.mailing'));
    await user.updateData({
        state: 'mailing'
    });
}

export { handleMailingCommand }