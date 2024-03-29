import fs from "fs";
import {join, resolve} from "path";
import {buildKeyboard} from "../../helpers/keyboard.js";

async function handleStateClick(ctx, next) {
    const {command, regionId,stateId} = ctx.callbackQuery?.data?JSON.parse(ctx.callbackQuery.data):{}
    if (command !== 'countryState') {
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
                inline_keyboard: [
                    ...otgKeyboards,
                    [
                        {
                            text: await ctx.i18n.t('buttons.back'),
                            callback_data: JSON.stringify({
                                command: 'backToCountryState',
                                regionId,
                                stateId
                            })
                        }
                    ]
                ],
            },
        }
    )
}

export { handleStateClick }
