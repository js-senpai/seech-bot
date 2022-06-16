import { getOneUser, updateUserData } from '../services/database/user.js'
import { ticketSchema } from './ticket.js'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	userId: {
		type: Number,
		unique: true,
		required: true
	},
	name: {
		type: String
	},
	phone: {
		type: Number
	},
	state: {
		type: String,
		required: true,
		default: 'free'
	},
	ticket: {
		type: ticketSchema
	},
	basket: {
		type: [{
			date: {
				type: Date
			},
			id: {
				type: String
			}
		}]
	},
	personalDataProcessing: {
		type: Boolean,
		required: true,
		default: false
	},
	region: {
		type: Number
	},
	countryState: {
		type: String,
	    default: '-'
	},
	countryOtg: {
		type: String,
		default: '-'
	},
	rating: {
		type: Number,
		default: 0
	},
	reviewsNumber: {
		type: Number,
		default: 0
	},
	type: {
		type: String,
		default: 'user'
	},
	prevMenu: {
		type: String,
		default: 'mainMenu'
	}
},{
	collection: 'users',
	versionKey: false,
	timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

class userClass {
	static getOne(userId) {
		return getOneUser(this, userId)
	}
	updateData(updates) {
		return updateUserData.bind(this)(this.constructor, updates)
	}
}

export { userClass, userSchema }
