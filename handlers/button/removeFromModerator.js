import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleRemoveModeratorClick(ctx, next) {
    const {command, userId} = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'removeModerator'){
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
    if(user.type !== 'admin') {
        return await next()
    }
    await ctx.db.User.updateOne({
        userId
    },{
        type: 'user'
    });
    await ctx.editMessageReplyMarkup(
        buildKeyboard(ctx.i18n, {
            name: 'editModerator',
            data: {
                isModerator: false,
                userId,
                command: 'addModerator'
            }
        }).reply_markup
    )
}

export { handleRemoveModeratorClick }
