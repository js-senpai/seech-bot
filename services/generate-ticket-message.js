import { buildKeyboard } from '../helpers/keyboard.js'

const plainObject = object => JSON.parse(JSON.stringify(object))

function generateTicketMessage ({texts, ticket, user, userId,stars = 0,votes = 0}) {
	const empty = 5 - stars
	const emptyString = `${texts.t('entities.noStar')} `
	const starString = `${texts.t('entities.star')} `
	const keyboard = buildKeyboard(texts, {
		name: 'ticketActions',
		data: {
			photo: ticket.photo,
			id: ticket._id,
			basket: ticket.authorId !== userId,
			sale: ticket.sale
		}
	})
	const template = ticket.sale
		? 'entities.sellingTicket'
		: 'entities.buyingTicket'
	const isActive = Date.now() - ticket.date <= 24 * 60 * 60 * 1000
	const text = texts.t(
		template + (ticket.authorId === userId ? 'Own' : ''),
		Object.assign(plainObject(ticket), {
			userId: ticket.authorId,
			active: texts.t(isActive ? 'entities.active' : 'entities.inactive'),
			date: ticket.date.toLocaleString('RU'),
			phone: user.phone || texts.t('errors.noPhone'),
			name: user.name || texts.t('errors.noName'),
			region: texts.t(
				user.region
					? `buttons.regions.${user.region}`
					: 'errors.noRegion'
			),
			...(ticket.sale && {
				votes,
				stars: starString.repeat(stars) + emptyString.repeat(empty),
			}),
			weightValue: texts.t(`types.${ticket.weightType === 'liter' ? 'volumeValue': 'weightValue'}`),
			weightName: texts.t(`types.${ticket.weightType === 'liter' ? 'volume': 'weight'}`)
		})
	)
	return { text, keyboard }
}

export { generateTicketMessage }
