import { buildKeyboard } from '../helpers/keyboard.js'

const plainObject = object => JSON.parse(JSON.stringify(object))

function generateTicketMessage ({currentUser,texts, ticket, user, userId,stars = 0,votes = 0}) {
	const empty = 5 - stars
	const emptyString = `${texts.t('entities.noStar')} `
	const starString = `${texts.t('entities.star')} `
	const keyboard = buildKeyboard(texts, {
		name: 'ticketActions',
		data: {
			photo: ticket.photo,
			id: ticket._id,
			basket: ticket.authorId !== userId,
			sale: ticket.sale,
			deleteFromBasket: currentUser.basket.findIndex(({id}) => ticket._id.toString() === id.toString()) !== -1
		}
	})
	const template = ticket.sale
		? 'entities.sellingTicket'
		: 'entities.buyingTicket'
	const isActive = Date.now() - ticket.date <= 24 * 60 * 60 * 1000
	let weightValue;
	switch (ticket.weightType){
		case 'liter':
			weightValue = 'volumeValue';
			break;
		case 'weight':
			weightValue = 'weightValue';break;
		case 'weightTon':
			weightValue = 'weightTonValue';break;
		case 'amount':
			weightValue = 'amountValue';break;
		default:
			weightValue = 'weightValue'
	}
	let weightName;
	switch (ticket.weightType){
		case 'liter':
			weightName = 'volume';
			break;
		case 'weight':
		case 'weightTon':
			weightName = 'weight';break;
		case 'amount':
			weightName = 'amount';break;
		default:
			weightName = 'weight'
	}
	const text = texts.t(
		template + (ticket.authorId === userId ? 'Own' : ''),
		Object.assign(plainObject(ticket), {
			userId: ticket.authorId,
			active: texts.t(isActive ? 'entities.active' : 'entities.inactive'),
			date: ticket.date.toLocaleString('RU'),
			phone: user?.phone || texts.t('errors.noPhone'),
			name: user?.name || texts.t('errors.noName'),
			region: texts.t(
				user?.region
					? `buttons.regions.${user?.region}.name`
					: 'errors.noRegion'
			),
			otg: texts.t(
				user?.region && user?.countryState && user?.countryOtg && user?.countryOtg !== '-'
					? `buttons.regions.${user?.region}.states.${user?.countryState}.otg.${user?.countryOtg}`
					: 'errors.noRegion'
			),
			...(ticket.sale && {
				votes,
				stars: starString.repeat(stars) + emptyString.repeat(empty),
			}),
			weightValue: texts.t(`types.${weightValue}`),
			weightName: texts.t(`types.${weightName}`)
		})
	)
	return { text, keyboard }
}

export { generateTicketMessage }
