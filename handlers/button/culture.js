import {buildKeyboard} from "../../helpers/keyboard.js";
import fs from "fs";
import {join, resolve} from "path";

async function getCultureName(texts, cultureCode) {
	const getLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
	const parseLocales = JSON.parse(getLocales)
	let culture;
	for(const [key] of Object.entries(parseLocales.buttons)){
		if(key === cultureCode){
			culture = texts.t(`buttons.${cultureCode}`)
		} else if(parseLocales.buttons[key][cultureCode]){
			culture = texts.t(`buttons.${key}.${cultureCode}`)
		}
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
			'ticket.culture': await getCultureName(ctx.i18n, culture)
		})
		await ctx.textTemplate('input.liter',{
			product: updateUser.ticket.culture
		})
	} else {
		const updateUser = await user.updateData({
			state: 'weight',
			'ticket.culture': await getCultureName(ctx.i18n, culture)
		})
		await ctx.textTemplate('input.weight',{
			product: updateUser.ticket.culture
		})
	}

}

export { handleCultureClick }
