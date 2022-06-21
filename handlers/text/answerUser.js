import {nanoid} from "nanoid";
import {buildKeyboard} from "../../helpers/keyboard.js";
import moment from "moment";

async function handleAnswerUserInput(ctx, next) {
    const user = await ctx.getUser()
    const readState = user.state.split('_');
    if(readState.length < 2){
        return await next()
    }
    if (readState[0] !== 'answerUser') {
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
    await ctx.telegram.sendMessage(
        readState[1],
        await ctx.i18n.t('input.answerUser',{
            name: user.name,
            message: ctx.message.text
        }),
        buildKeyboard(ctx.i18n, {
            name: 'answerUser',
            data: {
                userId: user.userId
            }
        })
    );
    await user.updateData({
        state: ''
    })
}

export { handleAnswerUserInput }
