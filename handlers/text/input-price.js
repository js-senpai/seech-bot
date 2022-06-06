import {buildKeyboard} from "../../helpers/keyboard.js";

async function handlePriceInput(ctx, next) {
	const user = await ctx.getUser()
	if (user.state !== 'price') {
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
	const price = ctx.message.text
	if (isNaN(price)) {
		await ctx.textTemplate('errors.invalid.price')
		return
	}
	await ctx.textTemplate('input.description')
	await user.updateData({
		'ticket.price': price,
		state: 'description'
	})
}

export { handlePriceInput }
