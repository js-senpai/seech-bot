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
    const getUsers = await ctx.db.User.find({
        userId: {
            $ne: user.userId
        }
    });
    const messagesList = [];
    console.log(ctx.message)
    if(ctx.message?.text){
        for(const {userId} of getUsers) {
            if(userId){
                messagesList.push(sendMessage.bind(ctx)(ctx.message.text,{ userId }));
            }
        }
    } else if(ctx?.message?.photo){
        for(const {userId} of getUsers) {
            if(userId){
                messagesList.push(ctx.telegram.sendPhoto(
                    userId,
                    ctx.message.photo[ctx.message.photo.length - 1].file_id,
                    {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        ...(ctx.message?.caption && {
                            caption: ctx.message?.caption
                        })
                    }
                ))
            }
        }
    } else if(ctx?.message?.video){
        for(const {userId} of getUsers) {
            if(userId){
                messagesList.push(ctx.telegram.sendVideo(
                    userId,
                    ctx.message.video.file_id,
                    {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        ...(ctx.message?.caption && {
                            caption: ctx.message?.caption
                        })
                    }
                ))
            }
        }
    }

    await Promise.all(messagesList);
    await user.updateData({
        state: ''
    })
}

export { handleMailingTextInput }