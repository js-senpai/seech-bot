import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handlePersonalCabinetCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'personalCabinet')) {
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
        _id: user._id
    },{
        prevMenu: 'adminMenu'
    })
    await ctx.textTemplate(
        'responses.choose',
        {},
        buildKeyboard(ctx.i18n, {
            name: 'personalCabinet',
            inline: false,
            columns: 2,
        })
    )
}

export { handlePersonalCabinetCommand }