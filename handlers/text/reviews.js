import {notButtonClick} from "../../services/not-button-click.js";
import moment from "moment";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleReviewsCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'reviews')) {
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
    if(user.type !== 'admin' && user.type !== 'moderator') {
        return await next()
    }
    await ctx.db.User.updateOne({
        _id: user._id
    },{
        prevMenu: 'adminMenu'
    })
    // Get user
    const getUsers = await ctx.db.User.find()
    for(const { _id,phone,name } of getUsers){
        // Get reviews
        const getReviews = await ctx.db.ReviewOfService.find({
            userId: _id
        })
        for(const { text, value,createdAt } of getReviews) {
            await ctx.textTemplate(ctx.i18n.t('reviews.text',{
                    phone,
                    name,
                    value,
                    text,
                    date: moment(createdAt).format('DD.MM.YYYY')
            }))
        }
    }
}

export { handleReviewsCommand }