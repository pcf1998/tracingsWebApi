const chai = require("chai")
const server = require("../../../bin/www")
const expect = chai.expect
const request = require("supertest")
let mongoose = require("../../../routes/db")

describe("MongoDB Atlas", () => {

    describe("Connect the MongoDB Atlas", () => {

        it("should connect the MongoDB Atlas successfully", done => {
            let username = "leopan"
            let password = "leo123456"
            let mongodburl = "mongodb+srv://" + username + ":" + password + "@wit-tracking-system-cluster-t9uwg.mongodb.net/tracingsdb"
            mongoose.connect(mongodburl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

            let db = mongoose.connection
            db.on("error", console.error.bind(console, "connection error"))
            db.once("open", function () {
                done()
            })

        })
    })

})
