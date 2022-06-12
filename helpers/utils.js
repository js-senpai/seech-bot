import fs from "fs";
import {join, resolve} from "path";

const getPriceStatistic = async ({ids = [],ctx}) => {
    const getRuLocales = await fs.promises.readFile(join(resolve(),'locales','ru.json'),{ encoding: 'utf8' })
    const getUaLocales = await fs.promises.readFile(join(resolve(),'locales','ua.json'),{ encoding: 'utf8' })
    const parseRu = JSON.parse(getRuLocales)
    const parseUa = JSON.parse(getUaLocales)
    const getPotatoes = [parseRu.buttons.vegetablesList.potatoes,parseUa.buttons.vegetablesList.potatoes]
    const getBeets = [parseRu.buttons.vegetablesList.beets,parseUa.buttons.vegetablesList.beets]
    const getCarrots = [parseRu.buttons.vegetablesList.carrots,parseUa.buttons.vegetablesList.carrots]
    const getPeppers = [parseRu.buttons.vegetablesList.peppers,parseUa.buttons.vegetablesList.peppers]
    const getOnions = [parseRu.buttons.vegetablesList.onions,parseUa.buttons.vegetablesList.onions]
    const getCucumbers = [parseRu.buttons.vegetablesList.cucumber,parseUa.buttons.vegetablesList.cucumber]
    const getCabbage = [parseRu.buttons.vegetablesList.cabbage,parseUa.buttons.vegetablesList.cabbage]
    const getTomato = [parseRu.buttons.vegetablesList.tomato,parseUa.buttons.vegetablesList.tomato]
    const getApples = [parseRu.buttons.fruitsList.apples,parseUa.buttons.fruitsList.apples]
    const getPeals = [parseRu.buttons.fruitsList.peals,parseUa.buttons.fruitsList.peals]
    const getPlums = [parseRu.buttons.fruitsList.plums,parseUa.buttons.fruitsList.plums]
    const getRaspberry = [parseRu.buttons.fruitsList.raspberry,parseUa.buttons.fruitsList.raspberry]
    const getStrawberry = [parseRu.buttons.fruitsList.strawberry,parseUa.buttons.fruitsList.strawberry]
    const getPeach = [parseRu.buttons.fruitsList.peach,parseUa.buttons.fruitsList.peach]
    const getApricot = [parseRu.buttons.fruitsList.apricot,parseUa.buttons.fruitsList.apricot]
    const getCherry = [parseRu.buttons.fruitsList.cherry,parseUa.buttons.fruitsList.cherry]
    const getGrape = [parseRu.buttons.fruitsList.grape,parseUa.buttons.fruitsList.grape]
    const getHoney = [parseRu.buttons.honey,parseUa.buttons.honey]
    const getNuts = [parseRu.buttons.walnuts,parseUa.buttons.walnuts]
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