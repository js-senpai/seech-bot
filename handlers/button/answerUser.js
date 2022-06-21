import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleAnswerUserClick(ctx, next) {
    const {command, userId} = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'answerUser'){
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
    await ctx.db.User.updateOne({
        userId: user.userId
    },{
        state: `answerUser_${userId}`
    });
}

export { handleAnswerUserClick }
