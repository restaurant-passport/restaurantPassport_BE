const axios = require("axios")
const bcrypt = require("bcryptjs")
const formData = require("express-form-data")
const cloudinary = require("cloudinary")

const { authenticate } = require("../auth/authenticate")
const tokenService = require("../auth/token-service.js")
const reviews = require("./reviews-model.js")
const users = require("./users-model.js")

module.exports = server => {
    server.post("/api/register", register) // username password
    server.post("/api/login", login) // same as above
    server.get("/api/user/:id/reviews", authenticate, getReviews)
    server.post("/api/user/review", authenticate, addReview)
    server.post(
        "/api/review/:id/image",
        authenticate,
        formData.parse(),
        addPhoto
    )
    server.get("/api/review/:id", authenticate, getReview)
    server.get("/api/review/:id/rating", authenticate, getByRating)
    server.get("/api/review/:id/type", authenticate, getByType)
    server.get("/api/review/:id/price", authenticate, getByPrice)
    server.delete("/api/review/:id", authenticate, deleteReview)
    server.put("/api/review/:id", authenticate, updateReview)
}

function register(req, res) {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 12) // 2 ^ n
    user.password = hash

    users
        .addUser(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(error => {
            res.status(500).json(error)
        })
}

function login(req, res) {
    const { username, password } = req.body

    users
        .findByUsername(username)
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = tokenService.generateToken(user)
                res.status(200).json({
                    message: `Welcome ${user.username}`,
                    token
                })
            } else {
                res.status(401).json({
                    message: "Invalid Credentials, Please Try Again."
                })
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
}

function getReviews(req, res) {
    const { id } = req.params

    reviews
        .getReviewsByUserId(id)
        .then(reviews => {
            res.status(200).json(reviews)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Error Fetching Reviews",
                error: err
            })
        })
}

function addReview(req, res) {
    const newReview = req.body

    reviews
        .add(newReview)
        .then(review => {
            res.status(201).json(review)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Error inserting review",
                error: err
            })
        })
}

//
const addPhoto = async ({ files, params }, res) => {
    let [images] = Object.values(files)
    image = Array.isArray(images) ? (image = images[0]) : images

    if (image !== undefined) {
        try {
            const { public_id } = await cloudinary.uploader.upload(image.path)
            const localImage = await reviews.addImage(public_id, params.id) // create local image path for accessing on cloudinary and relating it to a review
            res.json({ localImage })
        } catch (error) {
            res.status(500).json({ error })
        }
    } else res.status(500).json({ error: "No images found!" })
}

// returns all reviews when passed in the user's id on the req.param (in the url)
function getReview(req, res) {
    const { id } = req.params

    reviews
        .findById(id)
        .then(review => {
            res.status(200).json(review)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving review",
                error: err
            })
        })
}

// pass in the user's id on the req.param (in the url) and the foodrating object with the string "rating": "some food rating" in the object on the req.body
function getByRating(req, res) {
    const { id } = req.params
    const { rating } = req.body

    reviews
        .getByFoodrating(id, rating)
        .then(reviews => {
            res.status(200).json(reviews)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving review",
                error: err
            })
        })
}

function getByPrice(req, res) {
    const { id } = req.params
    const { price } = req.body

    reviews
        .getByFoodPrice(id, price)
        .then(reviews => {
            res.status(200).json(reviews)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving review",
                error: err
            })
        })
}

function getByType(req, res) {
    const { id } = req.params
    const { type } = req.body

    reviews
        .getByFoodType(id, type)
        .then(reviews => {
            res.status(200).json(reviews)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving review",
                error: err
            })
        })
}

function deleteReview(req, res) {
    const { id } = req.params

    reviews
        .deleteFoodReview(id)
        .then(review => {
            res.status(200).json(review)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Error Fetching Reviews",
                error: err
            })
        })
}

async function updateReview(req, res) {
    await reviews
        .updateFoodReview(req.params.id, req.body)
        .then(rev => {
            res.status(200).json(rev)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error updating review",
                error: err
            })
        })
}
