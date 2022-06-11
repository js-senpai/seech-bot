import { getOneTicket, updateTicketData } from '../services/database/ticket.js'
import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
	authorId: {
		type: Number
	},
	sale: {
		type: Boolean
	},
	weightType: {
	    type: String,
	    default: 'kilogram'
	},
	weight: {
		type: Number
	},
	price: {
		type: Number
	},
	description: {
		type: String,
		default: ' '
	},
	culture: {
		type: String
	},
	photo: {
		type: String
	},
	date: {
		type: Date
	},
	active: {
		type: Boolean,
		default: true
	},
	waitingForReview: {
		type: Boolean,
		default: false
	}
},{
	collection: 'tickets',
	versionKey: false,
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})


class ticketClass {
	static getOne(id) {
		return getOneTicket(this, id)
	}
	updateData(updates) {
		return updateTicketData.bind(this)(this.constructor, updates)
	}
}

export { ticketClass, ticketSchema }
