import {buildKeyboard} from "../../helpers/keyboard.js";
import {notButtonClick} from "../../services/not-button-click.js";

async function handleWeightTonInput(ctx, next) {
    const user = await ctx.getUser()
    const [name,count] = user.state.split('_');
    if (name !== 'weightTon') {
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
    if (!notButtonClick(ctx.i18n, ctx.message.text, 'cancelCreateTicket')) {
        return await next()
    }
    const weight = ctx.message.text
    if (isNaN(+weight) || +weight < +count) {
        await ctx.textTemplate('errors.invalid.weightTon',{
            count
        })
        return
    }
    await user.updateData({
        'ticket.weight': weight,
        'ticket.weightType': 'weightTon'
    })
    let state
    if (user.ticket?.sale) {
        await ctx.textTemplate('input.price',{
            weightValue: ctx.i18n.t(`types.weightTonValue`),
            product: user.ticket.culture
        })
        state = 'price'
    } else {
        await ctx.textTemplate(
            'input.comment',
            {},
            buildKeyboard(ctx.i18n, {
                name: 'skip'
            })
        )
        state = 'comment'
    }
    await user.updateData({ state })
}

export { handleWeightTonInput }