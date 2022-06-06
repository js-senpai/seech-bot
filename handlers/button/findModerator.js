import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleFindModeratorClick(ctx, next) {
    const {command} = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'findModerator'){
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
    await ctx.textTemplate('buttons.findModeratorByPhone')
    await user.updateData({
        state: 'findModeratorByPhone'
    })
}

export { handleFindModeratorClick }
