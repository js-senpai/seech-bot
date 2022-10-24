import {buildKeyboard} from "../../helpers/keyboard.js";
import {notButtonClick} from "../../services/not-button-click.js";

async function handleWeightCubeInput(ctx, next) {
    const user = await ctx.getUser()
    const [name,count] = user.state.split('_');
    if (name !== 'weightCube') {
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
        await ctx.textTemplate('errors.invalid.weightCube',{
            count
        })
        return
    }
    await user.updateData({
        'ticket.weight': weight,
        'ticket.weightType': 'weightCube'
    })
    let state
    if (user.ticket?.sale) {
        await ctx.textTemplate('input.price',{
            weightValue: ctx.i18n.t(`types.weightCubeValue`),
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

export { handleWeightCubeInput }