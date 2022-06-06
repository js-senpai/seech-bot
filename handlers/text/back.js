import { buildKeyboard } from '../../helpers/keyboard.js'
import { notButtonClick } from '../../services/not-button-click.js'

async function handleBackCommand(ctx, next) {
	if (notButtonClick(ctx.i18n, ctx.message.text, 'back')) {
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
	const { type = 'user', prevMenu = 'mainMenu',_id } = user
	switch (prevMenu){
		case 'statisticMenu':
			await ctx.db.User.updateOne({
				_id: _id
			},{
				prevMenu: 'adminMenu'
			});break;
		case 'adminMenu':
			await ctx.db.User.updateOne({
				_id: _id
			},{
				prevMenu: 'mainMenu'
			});break;
		default:
			await ctx.db.User.updateOne({
				_id: _id
			},{
				prevMenu: 'mainMenu'
			})
	}
	await ctx.textTemplate(
		prevMenu !== 'mainMenu' ? `buttons.${prevMenu}`: 'responses.mainMenu',
		{},
		buildKeyboard(ctx.i18n, {
			name: prevMenu,
			inline: false,
			columns: 2,
			data: {
				userType: type
			}
		})
	)
}

export { handleBackCommand }
