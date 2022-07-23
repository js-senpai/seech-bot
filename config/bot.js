import { path } from '../helpers/path-resolver.js'

import Telegraf from 'telegraf'
import { ExtendedContext } from './telegraf-context.js'

import { initLocalesEngine } from './locales.js'
import { processError } from '../helpers/global-errors-processor.js'

import { handleStartCommand } from '../handlers/text/start.js'
import { handleCreateTicketClick } from '../handlers/text/create-ticket.js'
import { handlePriceInput } from '../handlers/text/input-price.js'
import { handleWeightInput } from '../handlers/text/input-weight.js'
import { handleAnyTextMessage } from '../handlers/text/any.js'
import { handleDescriptionInput } from '../handlers/text/input-description.js'
import { handleShowTicketsClick } from '../handlers/text/show-tickets.js'
import { handleBackCommand } from '../handlers/text/back.js'
import { handleBasketCommand } from '../handlers/text/basket.js'

import { handleAnyButtonClick } from '../handlers/button/any.js'
import { handlePersonalDataProcessingClick } from '../handlers/button/data-processing.js'
import { handleRegionClick } from '../handlers/button/region.js'
import { handleCultureTypeClick } from '../handlers/button/culture-type.js'
import { handleCultureClick } from '../handlers/button/culture.js'
import { handleSkipClick } from '../handlers/button/skip.js'
import { handleShowPhotoClick } from '../handlers/button/show-photo.js'
import { handleExtendTicketClick } from '../handlers/button/extend-ticket.js'
import { handleAddToBasketClick } from '../handlers/button/add-to-basket.js'
import { handleRemoveTicketClick } from '../handlers/button/remove-ticket.js'
import { handleReviewClick } from '../handlers/button/review.js'

import { handleContact } from '../handlers/contact.js'
import { handlePhoto } from '../handlers/photo.js'
import {handleLiterInput} from "../handlers/text/input-liter.js";
import {handleReviewServiceInput} from "../handlers/text/reviewService.js";
import {handleReviewServiceTextInput} from "../handlers/text/input-text-review-service.js";
import {handleReviewServiceClick} from "../handlers/button/reviewService.js";
import {handleReviewSellerClick} from "../handlers/button/reviewSeller.js";
import {handleAnalyticsCommand} from "../handlers/text/analytics.js";
import {handleReviewsCommand} from "../handlers/text/reviews.js";
import {handleStatisticCommand} from "../handlers/text/statistic.js";
import {handleDateStatisticCommand} from "../handlers/text/dateStatistic.js";
import {handleModeratorsCommand} from "../handlers/text/getModerators.js";
import {handleAddModeratorClick} from "../handlers/button/addToModerator.js";
import {handleRemoveModeratorClick} from "../handlers/button/removeFromModerator.js";
import {handleFindModeratorClick} from "../handlers/button/findModerator.js";
import {handleFindModeratorCommand} from "../handlers/text/findModerator.js";
import {handleMailingCommand} from "../handlers/text/mailing.js";
import {handleMailingTextInput} from "../handlers/text/input-mailing.js";
import {handleAboutCommand} from "../handlers/text/about.js";
import {handleRegionsCommand} from "../handlers/text/regions.js";
import {handleCommentInput} from "../handlers/text/input-comment.js";
import {handleLoadMoreReviewsClick} from "../handlers/button/loadMoreReviews.js";
import {handleStateClick} from "../handlers/button/countryStates.js";
import {handleOtgClick} from "../handlers/button/countryOtg.js";
import {handleGetRegionsClick} from "../handlers/button/getRegions.js";
import {handlePersonalCabinetCommand} from "../handlers/text/personalCabinet.js";
import {handleChangeLocationInput} from "../handlers/text/changeLocation.js";
import {handleGetCountryStateClick} from "../handlers/button/getCountryState.js";
import {handleAnswerUserClick} from "../handlers/button/answerUser.js";
import {handleAnswerUserInput} from "../handlers/text/answerUser.js";
import {handleTotalUsersCommand} from "../handlers/text/totalUsers.js";
import {handleAmountInput} from "../handlers/text/input-amount.js";
import {handleInviteFriendCommand} from "../handlers/text/inviteFriend.js";
import {handleNumberOfBasketItemsCommand} from "../handlers/text/numberOfBasketItems.js";
import {handleLoadMoreTicketsClick} from "../handlers/button/loadMoreTickets.js";
import {handleCancelTicketCommand} from "../handlers/text/cancel-ticket.js";
import {handleWeightTonInput} from "../handlers/text/input-weight-ton.js";
import {handlePurchaseNotification} from "../handlers/text/purchaseNotification.js";
import {handleBuyNotification} from "../handlers/text/buyNotification.js";

async function initBot(dbInstance) {
	const bot = new Telegraf(process.env.TOKEN, {
		contextType: ExtendedContext
	})

	bot.context.db = dbInstance

	bot.use(Telegraf.session())
	const localeEngine = initLocalesEngine(path(import.meta.url, '../locales'))
	bot.use(localeEngine.middleware())

	bot.on('contact', handleContact)
	bot.on('photo', handlePhoto)

	bot.start(handleStartCommand)
	bot.on('message', handleDescriptionInput)
	bot.on('message', handlePriceInput)
	bot.on('message', handleWeightInput)
	bot.on('message', handleLiterInput)
	bot.on('message', handleCreateTicketClick)
	bot.on('message', handleShowTicketsClick)
	bot.on('message', handleBasketCommand)
	bot.on('message', handleBackCommand)
	bot.on('message', handleReviewServiceInput)
	bot.on('message', handleReviewServiceTextInput)
	bot.on('message', handleAnalyticsCommand)
	bot.on('message', handleReviewsCommand)
	bot.on('message', handleStatisticCommand)
	bot.on('message', handleDateStatisticCommand)
	bot.on('message', handleModeratorsCommand)
	bot.on('message', handleFindModeratorCommand)
	bot.on('message', handleMailingCommand)
	bot.on(['message','video','photo'], handleMailingTextInput)
	bot.on('message', handleAboutCommand)
	bot.on('message', handleRegionsCommand)
	bot.on('message', handleCommentInput)
	bot.on('message', handlePersonalCabinetCommand)
	bot.on('message', handleChangeLocationInput)
	bot.on('message', handleAnswerUserInput)
	bot.on('message', handleTotalUsersCommand)
	bot.on('message', handleAmountInput)
	bot.on('message', handleInviteFriendCommand)
	bot.on('message', handleNumberOfBasketItemsCommand)
	bot.on('message', handleCancelTicketCommand)
	bot.on('message', handleWeightTonInput)
	bot.on('message', handlePurchaseNotification)
	bot.on('message', handleBuyNotification)
	bot.on('message', handleAnyTextMessage)

	bot.on('callback_query', handleReviewClick)
	bot.on('callback_query', handleRemoveTicketClick)
	bot.on('callback_query', handleShowPhotoClick)
	bot.on('callback_query', handleAddToBasketClick)
	bot.on('callback_query', handleExtendTicketClick)
	bot.on('callback_query', handleSkipClick)
	bot.on('callback_query', handleRegionClick)
	bot.on('callback_query', handlePersonalDataProcessingClick)
	bot.on('callback_query', handleCultureTypeClick)
	bot.on('callback_query', handleCultureClick)
	bot.on('callback_query', handleReviewServiceClick)
	bot.on('callback_query', handleReviewSellerClick)
	bot.on('callback_query', handleAddModeratorClick)
	bot.on('callback_query', handleRemoveModeratorClick)
	bot.on('callback_query', handleFindModeratorClick)
	bot.on('callback_query', handleLoadMoreReviewsClick)
	bot.on('callback_query', handleStateClick)
	bot.on('callback_query', handleOtgClick)
	bot.on('callback_query', handleGetRegionsClick)
	bot.on('callback_query', handleGetCountryStateClick)
	bot.on('callback_query', handleAnswerUserClick)
	bot.on('callback_query', handleLoadMoreTicketsClick)
	bot.on('callback_query', handleAnyButtonClick)

	bot.catch(processError)

	return bot
}

export { initBot }
