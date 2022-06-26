import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleNumberOfBasketItemsCommand(ctx, next) {
    const user = await ctx.getUser()
    if (notButtonClick(ctx.i18n, ctx.message.text, 'numberOfBasketItems')){
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
    if(user.type !== 'admin' && user.type !== 'moderator') {
        return await next()
    }
    const [value] = await  ctx.db.User.aggregate([
        {
            $group: {
                "_id":"userId",
                total: { $sum:  { $size: "$basket" } }
            }
        }
    ]);
    await ctx.textTemplate(
        await ctx.i18n.t('input.numberOfBasketItems', {
            total: value?.total || 0
        })
    )
}

export { handleNumberOfBasketItemsCommand }