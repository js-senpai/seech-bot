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
	const cultureWithLiters = ['honey','milk','sourCream'];
	const cultureWithTon = ['wheat','barley','corn','buckwheat','soy'];
	if(cultureWithLiters.includes(culture)){
		let literCount = 1;
		switch (culture){
			case 'milk':
				literCount = 3; break;
			case 'sourCream':
				literCount = 1; break;
			default:
				literCount = 1;
		}
		const updateUser = await user.updateData({
			state: `liter_${literCount}`,
			'ticket.culture': await getCultureName(ctx.i18n, culture)
		})
		await ctx.textTemplate('input.liter',{
			product: updateUser.ticket.culture,
			number: literCount
		})
	} else if (cultureWithTon.includes(culture)) {
		let weightCount = 0.1
		const updateUser = await user.updateData({
			state: `weightTon_${weightCount}`,
			'ticket.culture': await getCultureName(ctx.i18n, culture)
		})
		await ctx.textTemplate('input.weightTon',{
			product: updateUser.ticket.culture,
			number: weightCount
		})
	} else if(culture === 'egg'){
		let amountCount = 10;
		const updateUser = await user.updateData({
			state: `amount_${amountCount}`,
			'ticket.culture': await getCultureName(ctx.i18n, culture)
		})
		await ctx.textTemplate('input.amount',{
			product: updateUser.ticket.culture,
			number: amountCount
		})
	}else if(culture === 'wood'){
		let woodCount = 1;
		const updateUser = await user.updateData({
			state: `weightCube_${woodCount}`,
			'ticket.culture': await getCultureName(ctx.i18n, culture)
		})
		await ctx.textTemplate('input.weightCube',{
			product: updateUser.ticket.culture,
			number: woodCount
		})
	} else {
		let weightCount = 1;
		switch (culture){
			case 'chicken':
			case 'fish':
			case 'pork':
			case 'veal':
			case 'cottage':
				weightCount = 1;break;
			default:
				weightCount = 1;
		}
		const updateUser = await user.updateData({
			state: `weight_${weightCount}`,
			'ticket.culture': await getCultureName(ctx.i18n, culture)
		})
		await ctx.textTemplate('input.weight',{
			product: updateUser.ticket.culture,
			number: weightCount
		})
	}

}

export { handleCultureClick }
