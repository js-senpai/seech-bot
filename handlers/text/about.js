import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleAboutCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'about')) {
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
    await ctx.textTemplate(await ctx.i18n.t('input.about'));
}

export { handleAboutCommand }