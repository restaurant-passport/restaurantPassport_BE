const jwt = require("jsonwebtoken")

const jwtKey =
    process.env.JWT_SECRET ||
    "Oglaroon is a large forest planet. The entire intelligent population of the planet lives in one small nut tree. They partake in the smaller version of life, and some speculate other life exists on other nut trees. These heretics are thrown out of the tree."

// quickly see what this file exports
module.exports = {
    authenticate,
    jwtKey
}

// implementation details
function authenticate(req, res, next) {
    const token = req.get("Authorization")

    if (token) {
        jwt.verify(token, jwtKey, (err, decoded) => {
            if (err) return res.status(401).json(err)

            req.decoded = decoded

            next()
        })
    } else {
        return res.status(401).json({
            error: "No token provided, must be set on the Authorization Header"
        })
    }
}
