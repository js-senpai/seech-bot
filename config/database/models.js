import {userClass, userSchema} from '../../entities/user.js'
import {ticketClass, ticketSchema} from '../../entities/ticket.js'

import mongoose from 'mongoose'
import {reviewOfServiceSchema} from "../../entities/reviewOfService.js";
import {reviewOfSellerSchema} from "../../entities/reviewOfSeller.js";
import {availableTicketsSchema} from "../../entities/availableTickets.js";

function initEntityModel(name, entitySchema, entityClass) {
	if(entityClass){
		entitySchema.loadClass(entityClass)
	}
	return new mongoose.model(name, entitySchema)
}

function initModels() {
	return {
		User: initEntityModel('User', userSchema, userClass),
		Ticket: initEntityModel('Ticket', ticketSchema, ticketClass),
		ReviewOfService: initEntityModel('ReviewOfService', reviewOfServiceSchema),
		ReviewOfSeller: initEntityModel('ReviewOfSeller', reviewOfSellerSchema),
		AvailableTickets: initEntityModel('AvailableTickets', availableTicketsSchema)
	}
}

export { initModels }
