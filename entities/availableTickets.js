import mongoose from "mongoose";

const availableTicketsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    done: {
        type: Boolean,
        default: false
    },
    totalNumber: {
        type: Number,
        default: 0,
        validate: {
            validator(value){
                return value >= 0
            },
            message: (props) => `${props.value} is not a valid`
        }
    },
    availableNumber: {
        type: Number,
        default: 5,
        validate: {
            validator(value){
                return value >= 0
            },
            message: (props) => `${props.value} is not a valid`
        }
    }
},{
    collection: 'availableTickets',
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})


export { availableTicketsSchema }