import { finishCreatingTicket } from '../create-ticket.js'
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleWeightInput(ctx, next) {
	const user = await ctx.getUser()
	if (user.state !== 'weight') {
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
	const weight = ctx.message.text
	if (isNaN(weight) || weight < 10) {
		await ctx.textTemplate('errors.invalid.weight',{
			weightValue: ctx.i18n.t(`types.weightValue`)
		})
		return
	}
	const updateUser = await user.updateData({
		'ticket.weight': weight,
	})
	let state = 'free'
	if (user.ticket?.sale) {
		await ctx.textTemplate('input.price',{
            weightValue: ctx.i18n.t(`types.weightValue`)
        })
		state = 'price'
	} else {
		await finishCreatingTicket(ctx, updateUser)
	}
	await user.updateData({ state })
}

export { handleWeightInput }
