import mongoose from "mongoose";

const reviewOfServiceSchema = new mongoose.Schema({
   userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
   },
   uniqueId: {
       type: String,
       unique: true
   },
   done: {
       type: Boolean,
       default: false
   },
   text: {
     type: String,
     required: true,
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
    collection: 'reviewOfService',
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

export { reviewOfServiceSchema }
