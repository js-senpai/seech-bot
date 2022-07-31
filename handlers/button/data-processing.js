import { buildKeyboard } from '../../helpers/keyboard.js'
import {schedule} from "../../services/schedule.js";

async function handlePersonalDataProcessingClick(ctx, next) {
	const [command, result] = ctx.callbackQuery.data.split('_')
	if (!command.startsWith('personalData')) {
		return await next()
	}
	const user = await ctx.getUser()
	await user.updateData({
		personalDataProcessing: true
	})
	if (result === 'yes') {
		await ctx.textTemplate(
			'input.phone',
			{},
			buildKeyboard(ctx.i18n, {
				name: 'sendPhone',
				contact: true
			})
		)
		schedule(15, async () => {
			if(!user.phone){
				await ctx.textTemplate('input.checkRegistration')
			}
		})
	} else {
		await ctx.popup()
		await ctx.textTemplate(
			'responses.mainMenu',
			{},
			buildKeyboard(ctx.i18n, {
				name: 'mainMenu',
				inline: false,
				columns: 2,
				data: {
					userType: user.type
				}
			})
		)
	}
}

export { handlePersonalDataProcessingClick }
