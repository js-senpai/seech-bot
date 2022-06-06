import mongoose from "mongoose";

const reviewOfSellerSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
        required: false,
        default: ''
    },
    value: {
        type: Number,
        default: 1,
        validate: {
            validator(value){
                return value >= 1 && value <= 5
            },
            message: (props) => `${props.value} is not a valid` 
        }
    }
},{
    collection: 'reviewOfSeller',
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

export { reviewOfSellerSchema }
