import {nanoid} from "nanoid";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleReviewServiceTextInput(ctx, next) {
    const user = await ctx.getUser()
    if (user.state !== 'reviewService') {
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
    const id = nanoid(4);
    const getText = ctx.message.text
    await ctx.db.ReviewOfService.create({
        userId: user._id,
        text: getText,
        uniqueId: id
    })
    await ctx.reply(
        ctx.i18n.t('reviewService.starReview'),
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        ...Array.from({length: 5}, (_, s) => s + 1).flatMap((i) => ({
                            text: ctx.i18n.t(`buttons.review.${i}`),
                            callback_data: JSON.stringify({
                                command: 'reviewServiceRate',
                                value: i,
                                id
                            })
                        }))
                    ]
                ]
            }
        }
    )
    await user.updateData({
        state: 'reviewServiceRate'
    })
}

export { handleReviewServiceTextInput }
