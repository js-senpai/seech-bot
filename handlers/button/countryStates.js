import fs from "fs";
import {join, resolve} from "path";

async function handleStateClick(ctx, next) {
    const {command, regionId,stateId} = ctx.callbackQuery?.data?JSON.parse(ctx.callbackQuery.data):{}
    if (command !== 'countryState') {
        return await next()
    }
    const user = await ctx.getUser()
    await user.updateData({
        countryState: stateId
    })
    const getLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseLocales = JSON.parse(getLocales)
    const getOtg = parseLocales.buttons.regions[regionId].states[stateId].otg
    const otg = []
    for(const [otgId,name] of Object.entries(getOtg)){
        otg.push({
            name,
            otgId
        })
    }
    const otgKeyboards = otg.map(({name,otgId}) => [
        {
            text: name,
            callback_data: JSON.stringify({
                otgId,
                command: 'countryOtg'
            })
        }
    ])
    await ctx.textTemplate(
        'input.otg',
        {},
        {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: otgKeyboards,
            },
        }
    )
}

export { handleStateClick }
