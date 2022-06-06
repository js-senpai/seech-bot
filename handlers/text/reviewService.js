import {notButtonClick} from "../../services/not-button-click.js";
import moment from "moment";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleReviewServiceInput(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'reviewService')) {
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
    const getReview = await ctx.db.ReviewOfService.find({
        userId: user._id,
        checked: true,
    })
    const checkReview = getReview.filter(({updatedAt}) => moment().isSameOrBefore(moment(updatedAt),'day'));
    if(checkReview.length){
        await ctx.textTemplate('reviewService.reviewed')
    } else {
        await ctx.textTemplate('reviewService.textReview')
        await user.updateData({
            state: 'reviewService'
        })
    }
}

export { handleReviewServiceInput }
