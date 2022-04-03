const bookModel = require("../models/bookModel")
const reviewModel=require("../models/reviewModel")

const isValid = function (value) {
   if (typeof value === "undefined" || value === null) return false
   if (typeof value === 'string' && value.trim().length === 0) return false
   return true;
}

const isValidRequestBody = function (requestBody) {
   return Object.keys(requestBody).length > 0
}


const createBook = async function (req, res) {
   try {
      let data = req.body
      const { title, excerpt, userId, ISBN, category, subcategory } = data
      if (!isValidRequestBody(data)) {
         return res.status(400).send({ status: false, msg: "enter data in user body" })
      }
      if (!isValid(title)) {
         return res.status(400).send({ status: false, msg: "enter title in the body" })
      }
      if (!isValid(excerpt)) {
         return res.status(400).send({ status: false, msg: "enter excerpt in  body" })
      }
      if (!isValid(userId)) {
         return res.status(400).send({ status: false, msg: "enter valid userId" })
      }
      // const validUsrID=await bookModel.findOne({userId})
      // if(validUsrID){
      //   return res.status(400).send({status:false,msg:"id exist"})
      // }
      if (!isValid(ISBN)) {
         return res.status(400).send({ status: false, msg: "enter ISBN" })
      }
      if (!isValid(category)) {
         return res.status(400).send({ status: false, msg: "enter category" })
      }
      if (!isValid(subcategory)) {
         return res.status(400).send({ status: false, msg: "enter subcategory" })
      }

      const validTitle = await bookModel.findOne({ title })
      if (validTitle) {
         return res.status(400).send({ status: false, msg: "title is already exist" })
      }
      const validISBN = await bookModel.findOne({ ISBN })
      if (validISBN) {
         return res.status(400).send({ status: false, msg: "ISBN is already exist" })
      }

      const createDataBook = await bookModel.create(data)
      return res.status(201).send({ msg: "sucessfully created", data: createDataBook })
   } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
   }
}
const getBooksQuery = async function (req, res) {
   try {
      let filterquery = { isDeleted: false }
      let queryParams = req.query

      if (isValidRequestBody(queryParams)) {
         const { userId, category, subcategory } = queryParams

         if (queryParams.userId && isValidObjectId(userId)) {
            filterquery['userId'] = userId
         }

         if (isValid(category)) {
            filterquery['category'] = category.trim()
         }

         if (isValid(subcategory)) {

            filterquery['subcategory'] = subcategory.trim()

         }
      }


      const books = await bookModel.find(filterquery).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
      const sortedb = books.sort((a, b) => a.title.localeCompare(b.title));

      if (Array.isArray(sortedb) && sortedb.length === 0) {
         res.status(404).send({ msg: "No books found", status: false })
         return
      }
      const count = books.length
      if (books.length < 0) {
         res.status(404).send({ status: false, msg: "No books found" })
         return
      }else

      return res.status(200).send({ msg: "books list", numberofbooks: count, data: sortedb, status: true })
   } catch (err) {
      console.log(err)
     return res.status(500).send({ msg: err.message })
   }
}

const getBookByPath = async function (req, res) {
   try {
      let bookId = req.params.bookId

      if (!isValid(bookId)) {
         {
            res.status(400).send({ status: false, messege: "Please provide The bookid" });
            return
         }
      }

      if (!bookId) {
         return res.status(400).send({ status: false, msg: "enter valid bookId" })
      }

      let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
      if (!book) {
         return res.status(404).send({ msg: "No Book found" })
      } else {


         let allReviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

         if (!allReviews.length > 0) {
            let Data = {
               _id: book._id,
               title: book.title,
               excerpt: book.excerpt,
               userId: book.userId,
               ISBN: book.ISBN,
               category: book.category,
               subcategory: book.subcategory,
               reviews: book.reviews,
               releasedAt: book.releasedAt,
               // book,
               reviewsData: []


            };
            res.status(200).send({ status: true, data: Data });
            return;
         } else {

            let Data = {

               _id: book._id,
               title: book.title,
               excerpt: book.excerpt,
               userId: book.userId,
               ISBN: book.ISBN,
               category: book.category,
               subcategory: book.subcategory,
               reviews: book.reviews,
               releasedAt: book.releasedAt,
               reviewsData: allReviews

            };
            return res.status(200).send({
               status: true,
               message: `Successfully retrived all book data with reviews details`,
               data: Data,
            });
         }
      }
   } catch (err) {
      console.log(err)
      return res.status(500).send({ msg: err.message })
   }
}

const updateBooks = async function (req, res) {
   try {
      //let data = req.body
      let title = req.body.title
      let excerpt = req.body.excerpt
      let releasedAt = req.body.releasedAt
      let ISBN = req.body.ISBN
      let bookId = req.params.bookId
      let book = await bookModel.findOne({ _id: bookId, isDeleted: false })

      if (!book) {
         return res.status(400).send({ status: false, msg: "no book found" })
      }
      let allbook = await bookModel.findOneAndUpdate(
         { _id: bookId, isDeleted: false },
         { $set: { title: title, excerpt: excerpt, releasedAt: Date.now(), ISBN: ISBN } },
         { new: true })

      return res.status(200).send({ status: true, msg: allbook })



   } catch (err) {
      console.log(err)
      return res.status(500).send({ msg: err.message })
   }
}

const deleteByPath = async function (req, res) {
   try {
      let bookId = req.params.bookId
      let deletedAt = await bookModel.findOneAndUpdate({ _id: bookId }, { deletedAt: new Date }, { new: true })
      let book = await bookModel.findById(bookId)

      if (book) {
         let allOfBooks = await bookModel.findByIdAndUpdate(
            { _id: bookId, isDeleted: false }, //condition
            { isDeleted: true },  //update in data

            { new: true } // new: true - will give you back the updated document // Upsert: it finds and updates the document but if the doc is not found(i.e it does not exist) then it creates a new document i.e UPdate Or inSERT  
         )
         return res.status(200).send({ status: true, msg: "done", data: allOfBooks })
      } else {
         return res.status(404).send({ msg: "book is already deleted" })
      }


   }

   catch (err) {
      console.log(err)
     return res.status(500).send({ msg: err.message })
   }
}



module.exports.createBook = createBook
module.exports.getBooksQuery = getBooksQuery
module.exports.getBookByPath = getBookByPath
module.exports.updateBooks = updateBooks
module.exports.deleteByPath = deleteByPath

