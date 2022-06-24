import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleTotalUsersCommand(ctx, next) {
    const user = await ctx.getUser()
    if (notButtonClick(ctx.i18n, ctx.message.text, 'totalUsers')){
        return await next()
    }
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
    await ctx.textTemplate(
     await ctx.i18n.t('input.totalUsers', {
         total: await ctx.db.User.countDocuments()
     })
    )
}

export { handleTotalUsersCommand }