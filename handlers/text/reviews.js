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
    const { docs = [], hasNextPage = false} = await ctx.db.ReviewOfService.paginate({}, { page: 1,limit: 5,sort: { createdAt: -1 } });
    for(let i = 0;i < docs.length; i++) {
       const { userId,value,text,createdAt } =  docs[i];
       const getUser = await ctx.db.User.findOne({
           _id: userId
       })
        const { name,phone } = getUser || {name: 'undefined',phone: 'undefined'} ;
        if(i + 1 === docs.length && hasNextPage){
            await ctx.textTemplate(await ctx.i18n.t('reviews.text',{
                phone,
                name,
                value,
                text,
                date: moment(createdAt).format('DD.MM.YYYY')
            }),{  },
                {
                    reply_markup: {
                      inline_keyboard: [
                          ...buildKeyboard(ctx.i18n, {
                              name: 'answerUser',
                              data: {
                                  userId
                              }
                          }).reply_markup.inline_keyboard,
                          ...buildKeyboard(ctx.i18n, {
                              name: 'loadMoreReviews',
                              data: {
                                  page: 2
                              }
                          }).reply_markup.inline_keyboard
                      ]
                    }
                })
        } else {
            await ctx.textTemplate(ctx.i18n.t('reviews.text',{
                phone,
                name,
                value,
                text,
                date: moment(createdAt).format('DD.MM.YYYY')
            }), {},
                buildKeyboard(ctx.i18n, {
                    name: 'answerUser',
                    data: {
                        userId
                    }
                })
                )
        }
    }
}

export { handleReviewsCommand }