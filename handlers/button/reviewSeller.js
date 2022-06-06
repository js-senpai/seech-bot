import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleReviewSellerClick(ctx, next) {
    const {command,value = 5, id} = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'reviewBuyer'){
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
    const getSeller = await ctx.db.User.findOne({
        userId: id
    })
    const getUser = await ctx.getUser()
    await ctx.db.ReviewOfSeller.create({
        sellerId: getSeller._id,
        buyerId: getUser._id,
        value
    })
    await ctx.editMessageText(
        ctx.i18n.t('reviewSeller.thankYou')
    )
}

export { handleReviewSellerClick }
