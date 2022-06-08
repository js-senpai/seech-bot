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
    const getDate = moment()
    const getUsers = await ctx.db.User.find()
    const filteredUsers = getUsers.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month'))
    const getLocales = ctx.i18n.locale() === 'ru' ? await fs.promises.readFile(join(resolve(),'locales','ru.json'),{ encoding: 'utf8' }):await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseLocales = JSON.parse(getLocales)
    const users = []
    for (const [key, value] of Object.entries(parseLocales.buttons.regions)) {
        const getUsersByRegion = await ctx.db.User.find({
            region: key
        })
        const getTotal = getUsersByRegion.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month'))
        users.push({
            region: value,
            total: getTotal.length,
            percent: `${getTotal.length && filteredUsers.length ? (getTotal.length / filteredUsers.length) * 100 : 0}%`
        })
    }
    const filterRegions = users.sort((a,b) => b.total - a.total).map(({region,total,percent}) => `${region} - ${percent}(${total})`).join('\n')
    await ctx.textTemplate(filterRegions);
}

export { handleRegionsCommand }