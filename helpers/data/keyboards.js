const mainMenu = ({userType = 'user'}) =>  [['about'],['sell'], ['buy'], ['myTickets'], ['basket'], userType !== 'admin' || userType !== 'moderator' ? [] :['reviewService'],['adminMenu']]
const keyboards = {
	mainMenu,
	basketMenu: () => [['myBuyings'], ['myBasket'], ['back']],
	adminMenu: ({userType = 'user'}) => userType === 'admin' || userType === 'moderator' ? [['statisticMenu'],['prices'],['regionStat'],['reviews'],userType === 'moderator' ? []: ['moderatorList'],['mailing'],['back']]: [],
	statisticMenu: ({userType = 'user'}) => userType === 'admin' || userType === 'moderator' ? [['todayStat'],['yesterdayStat'],['currentMonthStat'],['allPeriodStat'],['customPeriodStat'],['back']]: [],
	sendPhone: () => [['sendPhone']],
	skipPhoto: () => [['skipPhoto', `skipPhoto`]],
	findModerator: ({command}) => [['findModerator',JSON.stringify({command})]],
	review: ({ authorId, mutual = false }) => [
		['review.1', `review_${authorId}_1_${mutual || ''}`],
		['review.2', `review_${authorId}_2_${mutual || ''}`],
		['review.3', `review_${authorId}_3_${mutual || ''}`],
		['review.4', `review_${authorId}_4_${mutual || ''}`],
		['review.5', `review_${authorId}_5_${mutual || ''}`]
	],
	cultureType: () => [
		['vegetables', `cultureType_vegetables`],
		['fruits', `cultureType_fruits`],
		['honey', `culture_honey`],
		['walnuts', `culture_walnuts`]
	],
	editModerator: ({ isModerator = false,userId,command }) => [
		[isModerator ? 'removeModerator':'addModerator',JSON.stringify({ userId, command })]
	],
	myTicket: ({ photo, date, id }) => {
		let keyboard = [['completed', `completed_${id}`]]
		keyboard.push(['remove', `remove_${id}`])
		if (Date.now() - date >= 24 * 60 * 60 * 1000) {
			keyboard.push(['extend', `extend_${id}`])
		}
		if (photo) {
			keyboard.push(['showPhoto', `showPhoto_${id}`])
		}
		return keyboard
	},
	ticketActions: ({ photo, id, basket = true, sale }) => {
		let keyboard = []
		if (basket && sale) {
			keyboard.push(['toBasket', `toBasket_${id}`])
		}
		if (photo) {
			keyboard.push(['showPhoto', `showPhoto_${id}`])
		}
		return keyboard
	},
	fruits: () => [
		['fruitsList.apples', `culture_apples`],
		['fruitsList.peals', `culture_peals`],
		['fruitsList.plums', `culture_plums`],
		['fruitsList.raspberry', `culture_raspberry`],
		['fruitsList.strawberry', `culture_strawberry`],
		['fruitsList.peach', `culture_peach`],
		['fruitsList.apricot', `culture_apricot`],
		['fruitsList.cherry', `culture_cherry`],
		['fruitsList.grape', `culture_grape`]
	],
	vegetables: () => [
		['vegetablesList.potatoes', `culture_potatoes`],
		['vegetablesList.beets', `culture_beets`],
		['vegetablesList.carrots', `culture_carrots`],
		['vegetablesList.peppers', `culture_peppers`],
		['vegetablesList.onions', `culture_onions`],
		['vegetablesList.tomato', `culture_tomato`],
		['vegetablesList.cabbage', `culture_cabbage`],
		['vegetablesList.cucumber', `culture_cucumber`]
	],
	regions: () => [
		['regions.0', `region_0`],
		['regions.1', `region_1`],
		['regions.2', `region_2`],
		['regions.3', `region_3`],
		['regions.4', `region_4`],
		['regions.5', `region_5`],
		['regions.6', `region_6`],
		['regions.7', `region_7`],
		['regions.8', `region_8`],
		['regions.9', `region_9`],
		['regions.10', `region_10`],
		['regions.11', `region_11`],
		['regions.12', `region_12`],
		['regions.13', `region_13`],
		['regions.14', `region_14`],
		['regions.15', `region_15`],
		['regions.16', `region_16`],
		['regions.17', `region_17`],
		['regions.18', `region_18`],
		['regions.19', `region_19`],
		['regions.20', `region_20`],
		['regions.21', `region_21`],
		['regions.22', `region_22`],
		['regions.23', `region_23`],
		['regions.24', `region_24`]
	],
	personalDataProcessing: () => [
		['yes', `personalData_yes`],
		['no', `personalData_no`]
	]
}

export { keyboards }
