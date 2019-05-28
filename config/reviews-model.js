const express = require("express")
const db = require("../data/dbConfig.js")

module.exports = {
    add,
    find,
    findBy,
    findById,
    getAllReviews,
    deleteFoodReview,
    getReviewsByUserId,
    getByFoodType,
    getByFoodRating,
    getByFoodPrice,
    addImage,
    updateFoodReview
}

async function addImage(pid, reviewId) {
    const photo = await db("reviews")
        .where("id", reviewId)
        .update({ photo: pid })

    return findById(reviewId)
}

function find() {
    return db("reviews")
}

async function findBy(filter) {
    return await db("reviews").where(filter)
}

async function add(review) {
    const [id] = await db("reviews").insert(review)

    return findById(id)
}

async function findBy(id) {
    return await db("reviews")
        .where({ id })
        .first()
}

async function getAllReviews() {
    return await db("reviews")
}

async function deleteFoodReview(id) {
    return await db("reviews")
        .where("id", id)
        .del()
}

async function getReviewsByUserId(id) {
    return db("reviews").where("userId", id)
}

async function findById(id) {
    return await db("reviews")
        .where({ id })
        .first()
}

async function getByFoodType(id, foodtype) {
    return await db("reviews").where({
        userId: id,
        foodType: foodtype
    })
}

async function getByFoodRating(id, ratingInput) {
    return await db("reviews").where({
        userId: id,
        rating: ratingInput
    })
}

async function getByFoodPrice(id, priceInput) {
    return await db("reviews").where({
        userId: id,
        price: priceInput
    })
}

async function updateFoodReview(id, changes) {
    console.log("review in model", id, changes)
    return await db("reviews")
        .where({ id })
        .update(changes, "*")
}
