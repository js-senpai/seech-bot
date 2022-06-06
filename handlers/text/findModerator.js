
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleFindModeratorCommand(ctx, next) {
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
    if (user.state !== 'findModeratorByPhone') {
        return await next()
    }
    // Get user
    const getUser = await ctx.db.User.findOne({
        phone: +ctx.message.text
    });
    if(getUser){
        const { phone,type,name,userId } = getUser
        await ctx.textTemplate(
            await ctx.i18n.t('input.moderator',{
                name,
                phone
            }),
            {
            },
            buildKeyboard(ctx.i18n, {
                name: 'editModerator',
                data: {
                    isModerator: type === 'moderator',
                    userId,
                    command:  type === 'moderator' ? 'removeModerator':'addModerator'
                }
            })
        )
    } else {
       await ctx.textTemplate(
           await ctx.i18n.t('errors.userNotFound'),
       )
    }
    await user.updateData({
        state: ''
    })
}

export { handleFindModeratorCommand }