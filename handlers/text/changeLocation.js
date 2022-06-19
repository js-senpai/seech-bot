import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleChangeLocationInput(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'changeLocation')) {
        return await next()
    }
    const user = await ctx.getUser()
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
    await ctx.textTemplate(
        'input.regions',
        {},
        buildKeyboard(ctx.i18n, {
            name: 'regions',
            columns: 3
        })
    )
}
export  { handleChangeLocationInput }