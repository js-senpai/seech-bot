import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleModeratorsCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'moderatorList')) {
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
    // Get user
    const getUsers = await ctx.db.User.find({
        type: {
            $ne: 'admin'
        }
    }).sort({ createdAt: -1 }).limit(5);
    for(const { userId, type = 'user',phone,name } of getUsers){
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
    }
    await ctx.textTemplate(
        await ctx.i18n.t('input.filterModeratorsByPhone'),
        {
        },
        buildKeyboard(ctx.i18n, {
            name: 'findModerator',
            data: {
                command: 'findModerator'
            }
        })
    )
}

export { handleModeratorsCommand }