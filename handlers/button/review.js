import { buildKeyboard } from '../../helpers/keyboard.js'

async function handleReviewClick(ctx, next) {
	const [command, authorId, rating, mutual] =
		ctx.callbackQuery.data.split('_')

	if (!command.startsWith('review')) {
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
	if (user.state === 'review') {
		await user.updateData({
			state: 'free'
		})
		await ctx.editMessageText(
			ctx.i18n.t('responses.review', {
				stars: ctx.i18n.t('entities.star').repeat(rating)
			})
		)
		const target = await ctx.db.User.getOne(authorId)
		if (target) {
			await target.updateData({
				$inc: {
					rating: Number(rating),
					reviewsNumber: 1
				}
			})
			if (mutual) {
				await target.updateData({
					state: `review`
				})
				await ctx.text(
					ctx.i18n.t(
						`input.${
							target.name ? 'mutualReview' : 'mutualReviewNoName'
						}`,
						{ name: target.name }
					),
					Object.assign(
						buildKeyboard(ctx.i18n, {
							name: 'review',
							columns: 2,
							data: {
								authorId: ctx.from.id
							}
						}),
						{ userId: authorId }
					)
				)
			}
		}
	} else {
		await ctx.editMessageReplyMarkup({})
	}
}

export { handleReviewClick }
