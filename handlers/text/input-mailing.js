import {buildKeyboard} from "../../helpers/keyboard.js";
import {sendMessage} from "../../services/send-message.js";

async function handleMailingTextInput(ctx, next) {
    const user = await ctx.getUser()
    if (user.state !== 'mailing') {
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
    const getUsers = await ctx.db.User.find();
    for(const {userId} of getUsers) {
        if(userId){
            await sendMessage(ctx.message.text,{ userId });
        }
    }
    await user.updateData({
        state: ''
    })
}

export { handleMailingTextInput }