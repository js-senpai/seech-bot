const getMainMenu = ({userType = 'user'}) => {
	switch (userType){
		case "user":
			return [['sell'], ['buy'], ['myTickets'], ['basket'],['personalCabinet'],['about'],['inviteFriend'],['reviewService']]
		case "admin":
			return [['sell'], ['buy'], ['myTickets'], ['basket'],['personalCabinet'],['about'],['inviteFriend'],['adminMenu']]
		case "moderator":
			return [['sell'], ['buy'], ['myTickets'], ['basket'],['personalCabinet'],['about'],['inviteFriend'],['reviewService'],['adminMenu']]
		default:
			return [['sell'], ['buy'], ['myTickets'], ['basket'],['personalCabinet'],['about'],['inviteFriend'],['reviewService']]
	}
}
const mainMenu = ({userType = 'user'}) =>  getMainMenu({userType})
const keyboards = {
	mainMenu,
	basketMenu: () => [['myBuyings'], ['myBasket'], ['back']],
	adminMenu: ({userType = 'user'}) => userType === 'admin' || userType === 'moderator' ? [['statisticMenu'],['regionStat'],['reviews'],userType === 'moderator' ? ['back']: ['moderatorList'],['mailing'],['back']]: [],
	statisticMenu: ({userType = 'user'}) => userType === 'admin' || userType === 'moderator' ? [['totalUsers'],['todayStat'],['yesterdayStat'],['currentMonthStat'],['allPeriodStat'],['customPeriodStat'],['back']]: [],
	personalCabinet: () => [['changeLocation'],['back']],
	sendPhone: () => [['sendPhone']],
	skip: () => [['skip', `skip`]],
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
		['walnuts', `culture_walnuts`],
		['meats', `cultureType_meats`],
		['milks', `cultureType_milks`],
	],
	editModerator: ({ isModerator = false,userId,command }) => [
		[isModerator ? 'removeModerator':'addModerator',JSON.stringify({ userId, command })]
	],
	answerUser: ({userId}) => [
        ['answerUser',JSON.stringify({ userId, command: 'answerUser' })]
	],
	loadMoreReviews: ({page = 1}) => [
		['loadMoreReviews',JSON.stringify({page,command: 'loadMoreReviews'})]
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
		console.log({
			basket,
			sale,
			photo
		})
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
	milks: () => [
		['milksList.milk', `culture_milk`],
		['milksList.cottage', `culture_cottage`],
		['milksList.sourCream', `culture_sourCream`],
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
	meats: () => [
		['meatsList.pork','culture_pork'],
		['meatsList.veal','culture_veal'],
		['meatsList.chicken','culture_chicken'],
		['meatsList.fish','culture_fish'],
		['meatsList.egg','culture_egg'],
	],
	regions: () => [
		['regions.0.name', `region_0`],
		['regions.1.name', `region_1`],
		['regions.2.name', `region_2`],
		['regions.3.name', `region_3`],
		['regions.4.name', `region_4`],
		['regions.5.name', `region_5`],
		['regions.6.name', `region_6`],
		['regions.7.name', `region_7`],
		['regions.8.name', `region_8`],
		['regions.9.name', `region_9`],
		['regions.10.name', `region_10`],
		['regions.11.name', `region_11`],
		['regions.12.name', `region_12`],
		['regions.13.name', `region_13`],
		['regions.14.name', `region_14`],
		['regions.15.name', `region_15`],
		['regions.16.name', `region_16`],
		['regions.17.name', `region_17`],
	],
	personalDataProcessing: () => [
		['yes', `personalData_yes`],
		['no', `personalData_no`]
	]
}

export { keyboards }
