import {buildKeyboard} from "../../helpers/keyboard.js";
import moment from "moment";

async function handleLoadMoreReviewsClick(ctx, next) {
    const { page = 1,command = '' } = JSON.parse(ctx.callbackQuery.data)
    if(command !== 'loadMoreReviews'){
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
    // Get user
    const { docs = [], hasNextPage = false} = await ctx.db.ReviewOfService.paginate({}, { page,limit: 5,sort: { createdAt: -1 } });
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
                                    page: page + 1
                                }
                            }).reply_markup.inline_keyboard
                        ]
                    }
                }
                )
        } else {
            await ctx.textTemplate(ctx.i18n.t('reviews.text',{
                phone,
                name,
                value,
                text,
                date: moment(createdAt).format('DD.MM.YYYY')
            }),{},
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

export { handleLoadMoreReviewsClick }