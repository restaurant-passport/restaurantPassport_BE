const jwt = require("jsonwebtoken")

const { jwtKey } = require("./authenticate.js")

module.exports = {
    generateToken
}

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username
    }

    const options = {
        expiresIn: "1d"
    }

    return jwt.sign(payload, jwtKey, options) // returns back a token
}
