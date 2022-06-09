import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";
import fs from "fs";
import {join, resolve} from "path";
import moment from "moment";

async function handleRegionsCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'regionStat')) {
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
    if(user.type !== 'admin' && user.type !== 'moderator') {
        return await next()
    }
    const getUsers = await ctx.db.User.countDocuments()
    const getLocales = ctx.i18n.locale() === 'ru' ? await fs.promises.readFile(join(resolve(),'locales','ru.json'),{ encoding: 'utf8' }):await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseLocales = JSON.parse(getLocales)
    const users = []
    for (const [key, value] of Object.entries(parseLocales.buttons.regions)) {
        const getUsersByRegion = await ctx.db.User.countDocuments({
            region: key
        })
        users.push({
            region: value,
            total: getUsersByRegion,
            percent: `${getUsersByRegion && getUsers ? (getUsersByRegion / getUsers) * 100 : 0}%`
        })
    }
    const filterRegions = users.sort((a,b) => b.total - a.total).map(({region,total,percent}) => `${region} - ${percent.toFixed(2)}(${total})`).join('\n')
    await ctx.textTemplate(filterRegions);
}

export { handleRegionsCommand }