const express = require("express")
const cors = require("cors")
const helmet = require("helmet")

const configureRoutes = require("../config/routes.js")

const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())

configureRoutes(server)

server.get("/", (req, res) => {
    res.send("I am Son of Hal ... I am always watching")
})

module.exports = server
