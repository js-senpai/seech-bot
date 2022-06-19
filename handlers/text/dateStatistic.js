import {notButtonClick} from "../../services/not-button-click.js";
import moment from "moment";
import * as fs from "fs";
import {join, resolve} from "path";
import {buildKeyboard} from "../../helpers/keyboard.js";
import {getPriceStatistic} from "../../helpers/utils.js";

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
    const getLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseLocale = JSON.parse(getLocales)
    const vegetables = [...Object.values(parseLocale.buttons.vegetablesList)]
    const fruits = [...Object.values(parseLocale.buttons.fruitsList)]
    const honey = [parseLocale.buttons.honey]
    const nuts = [parseLocale.buttons.walnuts]
    const users = await ctx.db.User.find()
    const boughtTicketsOnSale = await ctx.db.Ticket.find({
        sale: true,
        active: false
    });
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
    const getReviewService = await ctx.db.ReviewOfService.find();
    if(ctx.message.text === ctx.i18n.t('buttons.todayStat')){
        const getDate = moment()
        const getTicketsOnSale = ticketsOnSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day'))
        const filteredTicketsOnSale = getTicketsOnSale.length
        const getTicketsOnBuy = ticketsOnBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day'))
        const filteredTicketsOnBuy = getTicketsOnBuy.length
        const filteredReviewService = getReviewService.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).map(({_id}) => _id);
        const getAvgReview = filteredReviewService.length ? await ctx.db.ReviewOfService.aggregate([
            {
                $match: {
                    _id: {
                        $in: filteredReviewService
                    }
                }
            },
            {
                $group: {
                    "_id":"userId",
                    rate: { $avg: "$value" }
                }
            }
        ]):[]
        const { rate = 0 } = getAvgReview.length ? getAvgReview[0]: { rate: 0 }
        const getUserIds = [...getTicketsOnBuy.map(({authorId}) => authorId),...getTicketsOnSale.map(({authorId}) => authorId)];
        const usersCount = await ctx.db.User.countDocuments({
            userId: {
                $in: getUserIds
            }
        });
        const result = {
            rate: rate.toFixed(2),
            users: usersCount,
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
        // Send price statistic
        await getPriceStatistic({ids: boughtTicketsOnSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).map(({_id}) => _id),ctx});
    } else if(ctx.message.text === ctx.i18n.t('buttons.yesterdayStat')){
        const getDate = moment().subtract(1, 'days')
        const getTicketsOnSale = ticketsOnSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day'))
        const getTicketsOnBuy = ticketsOnBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day'))
        const filteredTicketsOnSale = getTicketsOnSale.length
        const filteredTicketsOnBuy = getTicketsOnBuy.length
        const filteredReviewService = getReviewService.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).map(({_id}) => _id);
        const getAvgReview = filteredReviewService.length ? await ctx.db.ReviewOfService.aggregate([
            {
                $match: {
                    _id: {
                        $in: filteredReviewService
                    }
                }
            },
            {
                $group: {
                    "_id":"userId",
                    rate: { $avg: "$value" }
                }
            }
        ]):[]
        const { rate = 0 } = getAvgReview.length ? getAvgReview[0]:{ rate: 0 }
        const getUserIds = [...getTicketsOnBuy.map(({authorId}) => authorId),...getTicketsOnSale.map(({authorId}) => authorId)];
        const usersCount = await ctx.db.User.countDocuments({
            userId: {
                $in: getUserIds
            }
        });
        const result = {
            rate: rate.toFixed(2),
            users: usersCount,
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
        // Send price statistic
        await getPriceStatistic({ids: boughtTicketsOnSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).map(({_id}) => _id),ctx});
    } else if(ctx.message.text === ctx.i18n.t('buttons.currentMonthStat')) {
        const getDate = moment()
        const getTicketsOnSale = ticketsOnSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month'))
        const getTicketsOnBuy = ticketsOnBuy.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month'))
        const filteredTicketsOnSale = getTicketsOnSale.length
        const filteredTicketsOnBuy = getTicketsOnBuy.length
        const filteredReviewService = getReviewService.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).map(({_id}) => _id);
        const getAvgReview = filteredReviewService.length ? await ctx.db.ReviewOfService.aggregate([
            {
                $match: {
                    _id: {
                        $in: filteredReviewService
                    }
                }
            },
            {
                $group: {
                    "_id":"userId",
                    rate: { $avg: "$value" }
                }
            }
        ]):[]
        const { rate = 0 } = getAvgReview.length ? getAvgReview[0]: { rate: 0 };
        const getUserIds = [...getTicketsOnBuy.map(({authorId}) => authorId),...getTicketsOnSale.map(({authorId}) => authorId)];
        const usersCount = await ctx.db.User.countDocuments({
            userId: {
                $in: getUserIds
            }
        });
        const result = {
            rate: rate.toFixed(2),
            users: usersCount,
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
        // Send price statistic
        await getPriceStatistic({ids: boughtTicketsOnSale.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).map(({_id}) => _id),ctx});
    } else if(ctx.message.text === ctx.i18n.t('buttons.allPeriodStat')){
        const filteredTicketsOnSale = ticketsOnSale.length
        const filteredTicketsOnBuy = ticketsOnBuy.length
        const filteredReviewService = getReviewService.map(({_id}) => _id);
        const getAvgReview = filteredReviewService.length ? await ctx.db.ReviewOfService.aggregate([
            {
                $match: {
                    _id: {
                        $in: filteredReviewService
                    }
                }
            },
            {
                $group: {
                    "_id":"userId",
                    rate: { $avg: "$value" }
                }
            }
        ]): []
        const { rate = 0 } = getReviewService.length ? getAvgReview[0]:{ rate: 0 }
        const getUserIds = [...ticketsOnSale.map(({authorId}) => authorId),...ticketsOnBuy.map(({authorId}) => authorId)];
        const usersCount = await ctx.db.User.countDocuments({
            userId: {
                $in: getUserIds
            }
        });
        const result = {
            rate: rate.toFixed(2),
            users: usersCount,
            date: 'Весь період',
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
        // Send price statistic
        await getPriceStatistic({ids: boughtTicketsOnSale.map(({_id}) => _id),ctx});
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
        const getTicketsOnSale = ticketsOnSale.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day'))
        const getTicketsOnBuy = ticketsOnBuy.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day'))
        const filteredTicketsOnSale = getTicketsOnSale.length
        const filteredTicketsOnBuy = getTicketsOnBuy.length

        const filteredReviewService = getReviewService.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day'))
            .map(({_id}) => _id)
        const getAvgReview = filteredReviewService.length ? await ctx.db.ReviewOfService.aggregate([
            {
                $match: {
                    _id: {
                        $in: filteredReviewService
                    }
                }
            },
            {
                $group: {
                    "_id":"userId",
                    rate: { $avg: "$value" }
                }
            }
        ]):[]
        const { rate = 0 } = getAvgReview.length ? getAvgReview[0]:{ rate: 0 }
        const getUserIds = [...getTicketsOnBuy.map(({authorId}) => authorId),...getTicketsOnSale.map(({authorId}) => authorId)];
        const usersCount = await ctx.db.User.countDocuments({
            userId: {
                $in: getUserIds
            }
        });
        const result = {
            rate: rate.toFixed(2),
            users: usersCount,
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
        // Send price statistic
        await getPriceStatistic({ids: boughtTicketsOnSale.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).map(({_id}) => _id),ctx});
    }
}

export { handleDateStatisticCommand }