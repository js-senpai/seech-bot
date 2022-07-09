import {buildKeyboard} from "../../helpers/keyboard.js";
import {notButtonClick} from "../../services/not-button-click.js";

async function handleAmountInput(ctx, next) {
    const user = await ctx.getUser()
    const [name,count] = user.state.split('_');
    if (name !== 'amount') {
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
    const amount = ctx.message.text
    if (isNaN(+amount) || +amount < +count) {
        await ctx.textTemplate('errors.invalid.amount',{
            count
        })
        return
    }
    const updateUser = await user.updateData({
        'ticket.weight': amount,
        'ticket.weightType': 'amount'
    })
    let state
    if (updateUser.ticket?.sale) {
        await ctx.textTemplate('input.price',{
            weightValue: ctx.i18n.t(`types.amountValue`),
            product: updateUser.ticket.culture
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

export { handleAmountInput }
