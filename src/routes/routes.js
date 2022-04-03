const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const bookController=require("../Controllers/bookController")
const authentication=require("../middleware/auth")
const authorisation=require("../middleware/auth")
const reviewController=require("../Controllers/reviewController")

router.post("/register",userController.CreateUser)
router.post("/login",userController.loginUser)
router.post("/createBook",authentication.authentication,bookController.createBook)
router.get("/getBook",authentication.authentication,bookController.getBooksQuery )
router.get("/books/:bookId",authentication.authentication,bookController.getBookByPath)
router.put("/books/:bookId",authentication.authentication,bookController.updateBooks)
router.delete("/books/:bookId",authentication.authentication,bookController.deleteByPath)

router.post("/books/:bookId/review",reviewController.createReveiws)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteRevByPath)


module.exports = router;