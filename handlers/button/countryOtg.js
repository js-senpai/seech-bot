import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleOtgClick(ctx, next) {
    const {command, otgId} = ctx.callbackQuery?.data?JSON.parse(ctx.callbackQuery.data):{}
    if (command !== 'countryOtg') {
        return await next()
    }
    const user = await ctx.getUser()
    await user.updateData({
        countryOtg: otgId
    })
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

export { handleOtgClick }
