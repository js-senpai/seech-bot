import {buildKeyboard} from "../../helpers/keyboard.js";

function getCultureName(texts, cultureCode) {
	let culture = texts.t(`buttons.fruitsList.${cultureCode}`)
	if(cultureCode === 'honey' || cultureCode === 'walnuts') {
		culture = texts.t(`buttons.${cultureCode}`)
	} else if (culture[8] === 'f') {
		culture = texts.t(`buttons.vegetablesList.${cultureCode}`)
	}
	return culture
}

async function handleCultureClick(ctx, next) {
	const [command, culture] = ctx.callbackQuery.data.split('_')
	if (!command.startsWith('culture')) {
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
	if(culture === 'honey'){
		const updateUser = await user.updateData({
			state: 'liter',
			'ticket.culture': getCultureName(ctx.i18n, culture)
		})
		await ctx.textTemplate('input.liter',{
			product: updateUser.ticket.culture
		})
	} else {
		const updateUser = await user.updateData({
			state: 'weight',
			'ticket.culture': getCultureName(ctx.i18n, culture)
		})
		await ctx.textTemplate('input.weight',{
			product: updateUser.ticket.culture
		})
	}

}

export { handleCultureClick }
