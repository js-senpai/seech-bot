import {notButtonClick} from "../../services/not-button-click.js";
import moment from "moment";
import * as fs from "fs";
import {join, resolve} from "path";
import {buildKeyboard} from "../../helpers/keyboard.js";

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
    const getRuLocales = await fs.promises.readFile(join(resolve(),'locales','ru.json'),{ encoding: 'utf8' })
    const getUaLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseRu = JSON.parse(getRuLocales)
    const parseUa = JSON.parse(getUaLocales)
    const vegetables = [...Object.values(parseRu.buttons.vegetablesList),...Object.values(parseUa.buttons.vegetablesList)]
    const fruits = [...Object.values(parseRu.buttons.fruitsList),...Object.values(parseUa.buttons.fruitsList)]
    const honey = [parseRu.buttons.honey,parseUa.buttons.honey]
    const nuts = [parseRu.buttons.walnuts,parseUa.buttons.walnuts]
    const users = await ctx.db.User.find()
    const ticketsOnSale = await ctx.db.Ticket.find({
        sale: true
    })
    const ticketsOnBuy = await ctx.db.Ticket.find({
        sale: false
    })
    const vegetablesSale = await ctx.db.Ticket.find({
        sale: true,
        culture: {
            $in: vegetables
        }
    })
    const fruitsSale = await ctx.db.Ticket.find({
        sale: true,
        culture: {
            $in: fruits
        }
    })
    const honeySale = await ctx.db.Ticket.find({
        sale: true,
        culture: {
            $in: honey
        }
    })
    const nutsSale = await ctx.db.Ticket.find({
        sale: true,
        culture: {
            $in: nuts
        }
    })
    const vegetablesBuy = await ctx.db.Ticket.find({
        sale: false,
        culture: {
            $in: vegetables
        }
    })
    const fruitsBuy = await ctx.db.Ticket.find({
        sale: false,
        culture: {
            $in: fruits
        }
    })
    const honeyBuy = await ctx.db.Ticket.find({
        sale: false,
        culture: {
            $in: honey
        }
    })
    const nutsBuy = await ctx.db.Ticket.find({
        sale: false,
        culture: {
            $in: nuts
        }
    })
    if(ctx.message.text === ctx.i18n.t('buttons.todayStat')){
        const getDate = moment()
        const filteredTicketsOnSale = ticketsOnSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
        const filteredTicketsOnBuy = ticketsOnBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
        const result = {
            date: getDate.format('DD-MM-YYYY'),
            reg: users.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length,
            ticketOnSale: filteredTicketsOnSale,
            ticketOnBuy: filteredTicketsOnBuy,
            vegetablesSale: (() => {
                const getStat = vegetablesSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            fruitsSale: (() => {
                const getStat = fruitsSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            honeySale: (() => {
                const getStat = honeySale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            nutsSale: (() => {
                const getStat = nutsSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            vegetablesBuy:(() => {
                const getStat = vegetablesBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            fruitsBuy: (() => {
                const getStat = fruitsBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            honeyBuy: (() => {
                const getStat = honeyBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            nutsBuy: (() => {
                const getStat = nutsBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })()
        }
        await ctx.textTemplate(ctx.i18n.t('statistic.text',result));
    } else if(ctx.message.text === ctx.i18n.t('buttons.yesterdayStat')){
        const getDate = moment().subtract(1, 'days')
        const filteredTicketsOnSale = ticketsOnSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
        const filteredTicketsOnBuy = ticketsOnBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
        const result = {
            date: getDate.format('DD-MM-YYYY'),
            reg: users.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length,
            ticketOnSale: filteredTicketsOnSale,
            ticketOnBuy: filteredTicketsOnBuy,
            vegetablesSale: (() => {
                const getStat = vegetablesSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            fruitsSale: (() => {
                const getStat = fruitsSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            honeySale: (() => {
                const getStat = honeySale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            nutsSale: (() => {
                const getStat = nutsSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            vegetablesBuy:(() => {
                const getStat = vegetablesBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            fruitsBuy: (() => {
                const getStat = fruitsBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            honeyBuy: (() => {
                const getStat = honeyBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            nutsBuy: (() => {
                const getStat = nutsBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })()
        }
        await ctx.textTemplate(ctx.i18n.t('statistic.text',result));
    } else if(ctx.message.text === ctx.i18n.t('buttons.currentMonthStat')) {
        const getDate = moment()
        const filteredTicketsOnSale = ticketsOnSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
        const filteredTicketsOnBuy = ticketsOnBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
        const result = {
            date: getDate.format('MM-YYYY'),
            reg: users.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length,
            ticketOnSale: filteredTicketsOnSale,
            ticketOnBuy: filteredTicketsOnBuy,
            vegetablesSale: (() => {
                const getStat = vegetablesSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            fruitsSale: (() => {
                const getStat = fruitsSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            honeySale: (() => {
                const getStat = honeySale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            nutsSale: (() => {
                const getStat = nutsSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            vegetablesBuy:(() => {
                const getStat = vegetablesBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            fruitsBuy: (() => {
                const getStat = fruitsBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            honeyBuy: (() => {
                const getStat = honeyBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            nutsBuy: (() => {
                const getStat = nutsBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })()
        }
        await ctx.textTemplate(ctx.i18n.t('statistic.text',result));
    } else if(ctx.message.text === ctx.i18n.t('buttons.allPeriodStat')){
        const filteredTicketsOnSale = ticketsOnSale.length
        const filteredTicketsOnBuy = ticketsOnBuy.length
        const result = {
            date: 'All period',
            reg: users.length,
            ticketOnSale: filteredTicketsOnSale,
            ticketOnBuy: filteredTicketsOnBuy,
            vegetablesSale: vegetablesSale.length > 0 ? (vegetablesSale.length / filteredTicketsOnSale * 100).toFixed(0) : 0,
            fruitsSale: fruitsSale.length > 0 ? (fruitsSale.length / filteredTicketsOnSale * 100).toFixed(0) : 0,
            honeySale: honeySale.length > 0 ? (honeySale.length / filteredTicketsOnSale * 100).toFixed(0) : 0,
            nutsSale: nutsSale.length > 0 ? (nutsSale.length / filteredTicketsOnSale * 100).toFixed(0) : 0,
            vegetablesBuy: vegetablesBuy.length > 0 ? (vegetablesBuy.length / filteredTicketsOnBuy * 100).toFixed(0) : 0,
            fruitsBuy: fruitsBuy.length > 0 ? (fruitsBuy.length / filteredTicketsOnBuy * 100).toFixed(0) : 0,
            honeyBuy: honeyBuy.length > 0 ? (honeyBuy.length / filteredTicketsOnBuy * 100).toFixed(0) : 0,
            nutsBuy: nutsBuy.length > 0 ? (nutsBuy.length / filteredTicketsOnBuy * 100).toFixed(0) : 0
        }
        await ctx.textTemplate(ctx.i18n.t('statistic.text',result));
    } else if(ctx.message.text === ctx.i18n.t('buttons.customPeriodStat')) {
        await ctx.textTemplate(ctx.i18n.t('statistic.format'))
        await user.updateData({
            state: 'setCustomPeriodStat',
        })
    } else if(user.state === 'setCustomPeriodStat'){
        await user.updateData({
            state: '',
        })
        const [startDate,endDate] = ctx.message.text.split('-')
        const filteredTicketsOnSale = ticketsOnSale.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
        const filteredTicketsOnBuy = ticketsOnBuy.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
        const result = {
            date: `${startDate}-${endDate}`,
            reg: users.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length,
            ticketOnSale: filteredTicketsOnSale,
            ticketOnBuy: filteredTicketsOnBuy,
            vegetablesSale: (() => {
                const getStat = vegetablesSale.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            fruitsSale: (() => {
                const getStat = fruitsSale.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            honeySale: (() => {
                const getStat = honeySale.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            nutsSale: (() => {
                const getStat = nutsSale.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
            })(),
            vegetablesBuy:(() => {
                const getStat = vegetablesBuy.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            fruitsBuy: (() => {
                const getStat = fruitsBuy.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            honeyBuy: (() => {
                const getStat = honeyBuy.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })(),
            nutsBuy: (() => {
                const getStat = nutsBuy.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
            })()
        }
        await ctx.textTemplate(ctx.i18n.t('statistic.text',result));
    }
}

export { handleDateStatisticCommand }