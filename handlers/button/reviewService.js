import {buildKeyboard} from "../../helpers/keyboard.js";
import moment from "moment";

async function handleReviewServiceClick(ctx, next) {
    const {command,value = 5, id} = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'reviewServiceRate'){
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
   await ctx.db.ReviewOfService.updateOne({
        userId: user._id,
        uniqueId: id
    },{
        value,
        done: true
    });
    await ctx.editMessageText(
        ctx.i18n.t('reviewService.thankYou')
    )
    const getAdmins = await ctx.db.User.find({
        type: 'admin'
    })
    const getReview = await ctx.db.ReviewOfService.findOne({
        userId: user._id,
        uniqueId: id
    })
    const { phone,name } = user;
    for(const { userId } of getAdmins) {
        await ctx.telegram.sendMessage(
            userId,
            ctx.i18n.t('reviews.text',{
                phone,
                name,
                value,
                text: getReview.text,
                date: moment(getReview.createdAt).format('DD.MM.YYYY')
            }),
        );
    }
}

export { handleReviewServiceClick }
