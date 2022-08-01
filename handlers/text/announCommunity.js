import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleAnnoutCommunityClick(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'announCommunity')) {
        return await next()
    }
    const user = await ctx.getUser()
    if (!user || !user.phone) {
        return await ctx.textTemplate(
            'input.personalDataProcessing',
            {},
            buildKeyboard(ctx.i18n, {
                name: 'personalDataProcessing',
                columns: 2
            })
        )
    }
    await ctx.textTemplate(
        'input.announCommunity',
        {},
        	{
        		parse_mode: 'HTML',
        		reply_markup: {
        			inline_keyboard: [
                        ...buildKeyboard(ctx.i18n, {
                            name: 'announSaleCommunity',
                        }).reply_markup.inline_keyboard,
                        ...buildKeyboard(ctx.i18n, {
                            name: 'announBuyCommunity',
                        }).reply_markup.inline_keyboard,
                    ]
        		}
        	}
    )
}

export { handleAnnoutCommunityClick }