import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";
async function handleAnalyticsCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'adminMenu')) {
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
    if(user.type !== 'admin' && user.type !== 'moderator') {
        return await next()
    }
    await ctx.db.User.updateOne({
        _id: user._id
    },{
        prevMenu: 'mainMenu'
    })
    await ctx.textTemplate(
        'responses.choose',
        {},
        buildKeyboard(ctx.i18n, {
            name: 'adminMenu',
            inline: false,
            columns: 2,
            data: {
                userType: user.type
            }
        })
    )
}

export { handleAnalyticsCommand }