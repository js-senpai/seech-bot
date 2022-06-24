import {notButtonClick} from "../../services/not-button-click.js";
import moment from "moment";
import * as fs from "fs";
import {join, resolve} from "path";
import {buildKeyboard} from "../../helpers/keyboard.js";
import {getPriceStatistic, getStatisticByPeriod} from "../../helpers/utils.js";

async function handleDateStatisticCommand(ctx, next) {
    const user = await ctx.getUser()
    if (notButtonClick(ctx.i18n, ctx.message.text, 'todayStat') &&
        notButtonClick(ctx.i18n, ctx.message.text, 'yesterdayStat') &&
        notButtonClick(ctx.i18n, ctx.message.text, 'currentMonthStat') &&
        notButtonClick(ctx.i18n, ctx.message.text, 'allPeriodStat') &&
        notButtonClick(ctx.i18n, ctx.message.text, 'customPeriodStat') &&
        user.state !== 'setCustomPeriodStat'
    ) {
        return await next()
    }
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
    await getStatisticByPeriod({ctx,user})
}

export { handleDateStatisticCommand }