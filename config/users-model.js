const express = require("express")
const db = require("../data/dbConfig.js")

module.exports = {
    addUser,
    findByUsername,
    findBy,
    findById
}

async function addUser(user) {
    const alreadyTaken = await findByUsername(user.username)
    if (!alreadyTaken) {
        const [id] = await db("users").insert(user)

        return findById(id)
    }
    return null
}

async function findByUsername(username) {
    const user = await db("users")
        .where("username", username)
        .first()

    return user
}

async function findBy(filter) {
    return db("users").where(filter)
}

async function findById(id) {
    return db("users")
        .select("id", "username")
        .where({ id })
        .first()
}
