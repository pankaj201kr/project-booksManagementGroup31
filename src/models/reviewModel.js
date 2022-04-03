const mongoose = require("mongoose")

const ObjectId=mongoose.Schema.Types.ObjectId
const reviewSchema=new mongoose.Schema({
    bookId:{
        type:ObjectId,
        required:true,
        ref:"books",
        trim:true
    },
    reviewedBy: {
        type:String,
        required:true,
          default :'Guest',
        
    },
    reviewedAt: {
        type:Date ,
        required:true
    },
    rating: {
        type:Number,
         minNumber: 1, 
         maxNumber:5,
          required:true
        },
        review: {
            type:String, 
            
        },
        isDeleted: {
            type:Boolean, 
            default: false
        },
},{timestamps:true})
module.exports=mongoose.model("reviews",reviewSchema)


// bookId: {type: ObjectId,
//     ref: "Booksp",
//     required:true}, 
// reviewedBy: {type:String,
//      required:true,
//      default:'Guest'}, 
// reviewedAt: {type:Date, 
//     required:true},

// rating: {type:Number,
//    required:true},
// review: { type: String}, 
// isDeleted: {type:Boolean, 
//      default: false}, 

