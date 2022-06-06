import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleAddModeratorClick(ctx, next) {
    const {command, userId} = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'addModerator'){
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
        type: 'moderator'
    });
    await ctx.db.User.findOne({
        userId
    })
    await ctx.editMessageReplyMarkup(
        buildKeyboard(ctx.i18n, {
            name: 'editModerator',
            data: {
                isModerator: true,
                userId,
                command: 'removeModerator'
            }
        }).reply_markup
    )
}

export { handleAddModeratorClick }
