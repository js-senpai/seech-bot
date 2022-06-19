import fs from "fs";
import {join, resolve} from "path";

async function handleRegionClick(ctx, next) {
	const [command, regionId] = ctx.callbackQuery.data.split('_')
	if (!command.startsWith('region')) {
		return await next()
	}
	const user = await ctx.getUser()
	await user.updateData({
		region: regionId
	})
	const getLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
	const parseLocales = JSON.parse(getLocales)
	const getStates = parseLocales.buttons.regions[regionId].states
	const states = []
	for(const [stateId,{name}] of Object.entries(getStates)){
		states.push({
			stateId,
			name,
			regionId
		})
	}
    const statesKeyboards = states.map(({stateId,name,regionId}) => [
		{
			text: name,
			callback_data: JSON.stringify({
			   stateId,
			   regionId,
			   command: 'countryState'
			})
		}
	])
	await ctx.textTemplate(
		'input.states',
		{},
		{
			parse_mode: 'HTML',
			reply_markup: {
				inline_keyboard: [
					...statesKeyboards,
					[
						{
							text: await ctx.i18n.t('buttons.back'),
							callback_data: JSON.stringify({
								command: 'backToRegions'
							})

						}
					]
				],
			},
		}
	)
}

export { handleRegionClick }
