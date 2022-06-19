import fs from "fs";
import {join, resolve} from "path";

const getPriceStatistic = async ({ids = [],ctx}) => {
    const getLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseLocale = JSON.parse(getLocales)
    const getPotatoes = [parseLocale.buttons.vegetablesList.potatoes]
    const getBeets = [parseLocale.buttons.vegetablesList.beets]
    const getCarrots = [parseLocale.buttons.vegetablesList.carrots]
    const getPeppers = [parseLocale.buttons.vegetablesList.peppers]
    const getOnions = [parseLocale.buttons.vegetablesList.onions]
    const getCucumbers = [parseLocale.buttons.vegetablesList.cucumber]
    const getCabbage = [parseLocale.buttons.vegetablesList.cabbage]
    const getTomato = [parseLocale.buttons.vegetablesList.tomato]
    const getApples = [parseLocale.buttons.fruitsList.apples]
    const getPeals = [parseLocale.buttons.fruitsList.peals]
    const getPlums = [parseLocale.buttons.fruitsList.plums]
    const getRaspberry = [parseLocale.buttons.fruitsList.raspberry]
    const getStrawberry = [parseLocale.buttons.fruitsList.strawberry]
    const getPeach = [parseLocale.buttons.fruitsList.peach]
    const getApricot = [parseLocale.buttons.fruitsList.apricot]
    const getCherry = [parseLocale.buttons.fruitsList.cherry]
    const getGrape = [parseLocale.buttons.fruitsList.grape]
    const getHoney = [parseLocale.buttons.honey]
    const getNuts = [parseLocale.buttons.walnuts]
    const [grape] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getGrape
                },
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
    const [cherry] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getCherry
                },
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
    const [apricot] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getApricot
                },
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
    const [peach] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getPeach
                },
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
    const [strawberry] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getStrawberry
                },
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
    const [raspberry] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getRaspberry
                },
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
    const [plums] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getPlums
                },
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
    const [peals] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getPeals
                },
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
    const [apples] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getApples
                },
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
    const [cabbage] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getCabbage
                },
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
    const [cucumber] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getCucumbers
                },
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
    const [onions] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getOnions
                },
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
    const [tomato] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getTomato
                },
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
    const [peppers] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getPeppers
                },
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
    const carrots =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getCarrots
                },
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
    const [potatoes] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getPotatoes
                },
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
    const [beets] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getBeets
                },
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
    const [honey] =  await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getHoney
                },
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
    const [nuts] = await  ctx.db.Ticket.aggregate([
        {
            $match: {
                sale: true,
                culture: {
                    $in: getNuts
                },
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
    await ctx.textTemplate(await ctx.i18n.t('input.prices',{
        potatoes: (potatoes?.avg || 0).toFixed(2),
        carrots: (carrots?.avg || 0).toFixed(2),
        onions: (onions?.avg || 0).toFixed(2),
        cabbage: (cabbage?.avg || 0).toFixed(2),
        beets: (beets?.avg || 0).toFixed(2),
        peppers: (peppers?.avg || 0).toFixed(2),
        tomato: (tomato?.avg || 0).toFixed(2),
        cucumber: (cucumber?.avg || 0).toFixed(2),
        apples: (apples?.avg || 0).toFixed(2),
        plums: (plums?.avg || 0).toFixed(2),
        strawberry: (strawberry?.avg || 0).toFixed(2),
        apricot: (apricot?.avg || 0).toFixed(2),
        peals: (peals?.avg || 0).toFixed(2),
        raspberry: (raspberry?.avg || 0).toFixed(2),
        peach: (peach?.avg || 0).toFixed(2),
        grape: (grape?.avg || 0).toFixed(2),
        cherry: (cherry?.avg || 0).toFixed(2),
        honey: (honey?.avg || 0).toFixed(2),
        nuts: (nuts?.avg || 0).toFixed(2)
    }));
}

export { getPriceStatistic }