import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handlePurchaseNotification(ctx, next) {
    let user = await ctx.getUser()
    if (notButtonClick(ctx.i18n, ctx.message.text, 'disablePurchaseNotification') && notButtonClick(ctx.i18n, ctx.message.text, 'enablePurchaseNotification')) {
        return await next()
    }
    const updateUser = await user.updateData({
        disablePurchaseNotification: !user.disablePurchaseNotification
    });
    await ctx.textTemplate(
        'responses.choose',
        {},
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

export { handlePurchaseNotification }