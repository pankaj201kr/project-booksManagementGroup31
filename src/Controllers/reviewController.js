const mongoose=require("mongoose")
const bookModel=require("../models/bookModel")
// const userModel=require("../models/userModel")
const reviewModel=require("../models/reviewModel")

const jwt=require("jsonwebtoken")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
 }
 
 const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
 }

 const createReveiws=async function (req,res){
     
     try {
         let data=req.body
         let bookid=req.params.bookId
         const{bookId,reviewedBy, reviewedAt,rating}=data
         
         if (!isValidRequestBody(data)) { 
            return res.status(400).send({ status: false, msg: "enter data in user body" })
        }
        if(!isValid(bookId)){
            return res.status(400).send({ status: false, msg: "enter book id" })
        }
        if(!isValid(reviewedBy)){
            return res.status(400).send({ status: false, msg: "enter reviewedBy" })
        }
        if(!isValid(reviewedAt)){
            return res.status(400).send({ status: false, msg: "enter reviewedAt" })
        }
        if(!isValid(rating)){
            return res.status(400).send({ status: false, msg: "enter rating" })
        }
        if(rating>5){
            return res.status(400).send({status:false,msg:"rating is not greater than 5"})
        }
        if(rating<=0){
            return res.status(400).send({status:false,msg:"rating is not less than 0"})
        }
        let book=  await bookModel.findOne({_id:bookid,isDeleted:false})
        if(!book){
            return res.status(404).send({status:false,msg:"book is not found"})

        }
        const newReview=await reviewModel.create(data)
        const updatednewReview=await bookModel.findByIdAndUpdate({_id:bookId,isDeleted:false},{$inc:{reviews:1}})
        console.log(newReview)
        return res.status(201).send({status:true,msg:"review updated",data:newReview})
        
        
     } catch (error) {
         return res.status(500).send({status:false,msg:error.message})
         
     }
 }

 const updateReview = async function (req, res) {
    try {
        
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "enter valid bookId" })
        }

        if (!reviewId) {
            return res.status(400).send({ status: false, msg: "enter valid reviewId in path parameter" })
        }

        if (req.body.rating > 5) {
            return res.status(400).send({ status: false, msg: "Rating should not be more than 5" })
        }

        if (req.body.rating <= 0) {
            return res.status(400).send({ status: false, msg: "Rating should not be less than 1" })
        }

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (book) {

            let review = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
            if (review) {
                let updateReview = await reviewModel.findOneAndUpdate(
                    { _id: reviewId, isDeleted: false },
                    { $set: { review: req.body.review, rating:req.body.rating, reviewedBy:req.body.reviewedBy }},
                    { new: true })

                return res.status(200).send({ data: updateReview })
            } else {
                return res.status(404).send({ status: false, msg: "No review Found" })
            }

        } else {
            return res.status(404).send({ status: false, msg: "no book found" })

        }




    } catch (err) {
        console.log(err)
       return res.status(500).send({ msg: err.message })
    }

}


const deleteRevByPath = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!bookId) {
            return res.status(400).send({ status: false, msg: "enter valid bookId in path param" })
        }

        if (!reviewId) {
            return res.status(400).send({ status: false, msg: "enter valid reviewId in path parameter " })
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (book) {

            let isReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
            if (isReview) {
                let delReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { isDeleted: true },{new:true})
                let updateInBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } })
                res.status(200).send({status:true,msg:"deleted  review done",data:delReview})
            } else {
              return  res.status(404).send({ msg: "No Review data found" })

            }
        } else {
           return  res.status(404).send({ msg: "No Book found" })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ msg: err.message })
    }
}

 module.exports.createReveiws=createReveiws
 module.exports.updateReview=updateReview
 module.exports.deleteRevByPath=deleteRevByPath
