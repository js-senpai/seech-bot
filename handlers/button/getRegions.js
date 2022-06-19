import {buildKeyboard} from "../../helpers/keyboard.js";
async function handleGetRegionsClick(ctx, next) {
    const {command} = ctx.callbackQuery?.data ? JSON.parse(ctx.callbackQuery.data) : {}
    if (command !== 'backToRegions') {
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
    await ctx.textTemplate(
        'input.regions',
        {},
        buildKeyboard(ctx.i18n, {
            name: 'regions',
            columns: 3
        })
    )
}
export { handleGetRegionsClick }