import fs from "fs";
import {join, resolve} from "path";
import moment from "moment";

const getPriceStatistic = async ({ids = [],ctx,localeData = [
    'vegetablesList',
    'fruitsList',
    'honey',
    'walnuts',
    'milksList',
    'meatsList'
]}) => {
    const getLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseLocale = JSON.parse(getLocales)
    let result = {}
    for(const localeName of localeData) {
        if(typeof parseLocale.buttons[localeName] === 'string'){
            const [value] = await  ctx.db.Ticket.aggregate([
                {
                    $match: {
                        sale: true,
                        culture: new RegExp(parseLocale.buttons[localeName], 'i'),
                        _id: {
                            $in: ids
                        }
                    }
                },
                {
                    $group: {
                        "_id":"authorId",
                        avg: { $avg: "$price" }
                    }
                }
            ]);
            result = {
                ...result,
                [localeName]: (value?.avg || 0).toFixed(2)
            }
        } else if(typeof parseLocale.buttons[localeName] === 'object') {
           for(const property in parseLocale.buttons[localeName]) {
               const [value] = await  ctx.db.Ticket.aggregate([
                   {
                       $match: {
                           sale: true,
                           culture: new RegExp(parseLocale.buttons[localeName][property], 'i'),
                           _id: {
                               $in: ids
                           }
                       }
                   },
                   {
                       $group: {
                           "_id":"authorId",
                           avg: { $avg: "$price" }
                       }
                   }
               ]);
               result = {
                   ...result,
                   [property]: (value?.avg || 0).toFixed(2)
               }
           }
        }
    }
    await ctx.textTemplate(await ctx.i18n.t('input.prices',result));
}

const getStatisticByPeriod = async ({
                                        user,
                                        ctx,
                                        localeData = [
                                            'vegetablesList',
                                            'fruitsList',
                                            'honey',
                                            'walnuts',
                                            'milksList',
                                            'meatsList'
                                        ]
}) => {
    const getReviewService = await ctx.db.ReviewOfService.find();
    const getLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseLocale = JSON.parse(getLocales)
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
    const itemsOnBuy = [];
    const itemsOnSale = [];
    // Get items on sale
    for(const localeName of localeData) {
        if (typeof parseLocale.buttons[localeName] === 'string') {
          const buttons = [parseLocale.buttons[localeName]]
          itemsOnSale.push({
              name: `${localeName}Sale`,
              data: await ctx.db.Ticket.find({
                  sale: true,
                  culture: {
                      $in: buttons
                  }
              })
          })
        } else if(typeof parseLocale.buttons[localeName] === 'object') {
            const buttons =  [...Object.values(parseLocale.buttons[localeName])]
            itemsOnSale.push({
                name: `${localeName}Sale`,
                data: await ctx.db.Ticket.find({
                    sale: true,
                    culture: {
                        $in: buttons
                    }
                })
            })
        }
    }
    // Get items on buy
    for(const localeName of localeData) {
        if (typeof parseLocale.buttons[localeName] === 'string') {
            const buttons = [parseLocale.buttons[localeName]]
            itemsOnBuy.push({
                name: `${localeName}Buy`,
                data: await ctx.db.Ticket.find({
                    sale: false,
                    culture: {
                        $in: buttons
                    }
                })
            })
        } else if(typeof parseLocale.buttons[localeName] === 'object') {
            const buttons =  [...Object.values(parseLocale.buttons[localeName])]
            itemsOnBuy.push({
                name: `${localeName}Buy`,
                data: await ctx.db.Ticket.find({
                    sale: false,
                    culture: {
                        $in: buttons
                    }
                })
            })
        }
    }
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
            ...Object.assign({}, ...itemsOnBuy.map(({name,data}) => ({
                [name]:(() => {
                    const getStat = data.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                    return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
                })()
            }))),
            ...Object.assign({}, ...itemsOnSale.map(({name,data}) => ({
                [name]:(() => {
                    const getStat = data.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                    return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
                })()
            }))),
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
            ...Object.assign({}, ...itemsOnBuy.map(({name,data}) => ({
                [name]:(() => {
                    const getStat = data.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                    return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
                })()
            }))),
            ...Object.assign({}, ...itemsOnSale.map(({name,data}) => ({
                [name]:(() => {
                    const getStat = data.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'day')).length
                    return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
                })()
            }))),
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
            ...Object.assign({}, ...itemsOnBuy.map(({name,data}) => ({
                [name]:(() => {
                    const getStat = data.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                    return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
                })()
            }))),
            ...Object.assign({}, ...itemsOnSale.map(({name,data}) => ({
                [name]:(() => {
                    const getStat = data.filter(({createdAt}) => createdAt &&  getDate.isSame(moment(createdAt),'month')).length
                    return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
                })()
            }))),
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
            ...Object.assign({}, ...itemsOnBuy.map(({name,data}) => ({
                [name]:data.length > 0 ? (data.length / filteredTicketsOnBuy * 100).toFixed(0) : 0
            }))),
            ...Object.assign({}, ...itemsOnSale.map(({name,data}) => ({
                [name]: data.length > 0 ? (data.length / filteredTicketsOnSale * 100).toFixed(0) : 0
            }))),
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
            ...Object.assign({}, ...itemsOnBuy.map(({name,data}) => ({
                [name]:(() => {
                    const getStat = data.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                    return getStat > 0 ? (getStat / filteredTicketsOnBuy * 100).toFixed(0): 0
                })()
            }))),
            ...Object.assign({}, ...itemsOnSale.map(({name,data}) => ({
                [name]:(() => {
                    const getStat = data.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).length
                    return getStat > 0 ? (getStat / filteredTicketsOnSale * 100).toFixed(0): 0
                })()
            }))),
        }
        await ctx.textTemplate(ctx.i18n.t('statistic.text',result));
        // Send price statistic
        await getPriceStatistic({ids: boughtTicketsOnSale.filter(({createdAt}) => createdAt &&  moment(createdAt).isBetween(moment(startDate,'DD-MM-YYYY'),moment(endDate,'DD-MM-YYYY'),'day')).map(({_id}) => _id),ctx});
    }
}

export { getPriceStatistic,getStatisticByPeriod }