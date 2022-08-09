import {notButtonClick} from "../../services/not-button-click.js";
import {buildKeyboard} from "../../helpers/keyboard.js";
import * as fs from "fs";
import {join} from "path";

async function handleAboutCommand(ctx, next) {
    if (notButtonClick(ctx.i18n, ctx.message.text, 'about')) {
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
    await ctx.replyWithVideo({
        source: fs.createReadStream(join('assets','video','welcome.MP4'))
    });
}

export { handleAboutCommand }