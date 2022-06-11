import {notButtonClick} from "../../services/not-button-click.js";
import moment from "moment";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleReviewsCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'reviews') && notButtonClick(ctx.i18n, ctx.message.text, 'loadMoreReviews')) {
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
    const { page = 1 } = ctx.callbackQuery?.data ? JSON.parse(ctx.callbackQuery.data): { page: 1 }
    await ctx.db.User.updateOne({
        _id: user._id
    },{
        prevMenu: 'adminMenu'
    })
    // Get user
    const { docs = [], hasNextPage = false} = await ctx.db.ReviewOfService.paginate({}, { page,limit: 5 });
    for(let i = 0;i < docs.length; i++) {
       const { userId,value,text,createdAt } =  docs[i];
       const getUser = await ctx.db.User.findOne({
           _id: userId
       })
       if(getUser) {
           const { name,phone } = getUser;
           if(i + 1 === docs.length && hasNextPage){
               await ctx.textTemplate(ctx.i18n.t('reviews.text',{
                   phone,
                   name,
                   value,
                   text,
                   date: moment(createdAt).format('DD.MM.YYYY')
               }),{ page: page + 1  },buildKeyboard(ctx.i18n, {
                   name: 'loadMoreReviews',
                   data: {
                       page: page + 1
                   }
               }))
           } else {
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
}

export { handleReviewsCommand }