import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleBuyNotification(ctx, next) {
    let user = await ctx.getUser()
    if (notButtonClick(ctx.i18n, ctx.message.text, 'disableBuyNotification') && notButtonClick(ctx.i18n, ctx.message.text, 'enableBuyNotification')) {
        return await next()
    }
    const updateUser = await user.updateData({
        disableBuyNotification: !user.disableBuyNotification
    })
    await ctx.textTemplate(
        'responses.choose',
        {
        },
        buildKeyboard(ctx.i18n, {
            name: 'personalCabinet',
            inline: false,
            columns: 2,
            data: {
                disableBuyNotification: updateUser.disableBuyNotification,
                disablePurchaseNotification: updateUser.disablePurchaseNotification
            }
        })
    )
}

export { handleBuyNotification }