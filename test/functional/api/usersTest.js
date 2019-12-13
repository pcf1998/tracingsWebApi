const chai = require("chai")
const server = require("../../../bin/www")
const expect = chai.expect
const request = require("supertest")
let mongoose = require("../../../routes/db")

describe("User", () => {

  describe("GET /users", () => {
    it("should return all the users", done => {
      request(server)
        .get("/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array")
          done(err)
        })
    })
  })

  describe("GET /users/:userID", () => {

    describe("when the user id is valid", () => {
      it("should return the matching user", done => {
        request(server)
          .get("/users/5db5789c3e7f3c0666c9c0b0")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.deep.include({_id: "5db5789c3e7f3c0666c9c0b0"})
            done(err)
          })
      })
    })

    describe("when the user id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .get("/users/9999")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message:
                            "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"User\"",
            name: "CastError",
            stringValue: "\"9999\"",
            kind: "ObjectId",
            value: "9999",
            path: "_id"
          }, (err, res) => {
            done(err)
          })
      })
    })

  })

  describe("POST /users", () => {
    it("should return confirmation message and add user", () => {
      let user = {
        userName: "testtesttest",
        userPassword: "test123456",
        email: "testtesttest@example.com",
        mobilePhone: "1023945886",
        gender: "male",
        dateOfBirth: "1949-10-01"
      }
      return request(server)
        .post("/users")
        .send(user)
        .expect(200)
        .expect({message: "User Successfully Added!"})
    })
  })

  describe("PUT /users/:userID/userName", () => {
    it("should return confirmation message and update user name", () => {
      request(server)
        .put("/users/5db5789c3e7f3c0666c9c0b0/userName")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .send({userName: "banana-test"})
        .expect(200)
        .end((err, res) => {
          expect({message: "user name Successfully Updated!"})
          done(err)
        })
    })
  })

  describe("PUT /users/:userID/userPassword", () => {
    it("should return confirmation message and update user password", () => {
      request(server)
        .put("/users/5db5789c3e7f3c0666c9c0b0/userPassword")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .send({userPassword: "banana123456789"})
        .expect(200)
        .end((err, res) => {
          expect({message: "User password Successfully Updated!"})
          done(err)
        })
    })
  })
  /*

    describe("PUT /users/:userID/status", () => {
        it("should return confirmation message and update user status", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/status")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({status: "off"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user status Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/department", () => {
        it("should return confirmation message and update user department", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/department")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({department: "Marketing"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user department Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/position", () => {
        it("should return confirmation message and update user position", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/position")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({position: "staff"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user position Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/email", () => {
        it("should return confirmation message and update user email", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/email")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({email: "banana-test@example.ie"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user email Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/mobilePhone", () => {
        it("should return confirmation message and update user mobilePhone", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/mobilePhone")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({mobilePhone: "8989898989"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user mobilePhone Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/fax", () => {
        it("should return confirmation message and update user fax", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/fax")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({fax: "banana-test's fax"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user fax Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/telephone", () => {
        it("should return confirmation message and update user telephone", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/telephone")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({telephone: "banana-test's telephone"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user telephone Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/address", () => {
        it("should return confirmation message and update user address", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/address")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({address: "banana-test's address"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user address Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/gender", () => {
        it("should return confirmation message and update user gender", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/gender")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({gender: "female"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user gender Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/dateOfBirth", () => {
        it("should return confirmation message and update user dateOfBirth", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/dateOfBirth")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({dateOfBirth: "1979-10-01"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user date Of Birth Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/educationalDegree", () => {
        it("should return confirmation message and update user educationalDegree", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/educationalDegree")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({educationalDegree: "master"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user educational Degree Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/maritalStatus", () => {
        it("should return confirmation message and update user maritalStatus", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/maritalStatus")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({maritalStatus: "married"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user marital Status Successfully Updated!"})
                    done(err)
                })
        })
    })

    describe("PUT /users/:userID/entryDate", () => {
        it("should return confirmation message and update user entryDate", () => {
            request(server)
                .put("/users/5db5789c3e7f3c0666c9c0b0/entryDate")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .send({entryDate: "2000-01-01"})
                .expect(200)
                .end((err, res) => {
                    expect({message: "user entry Date Successfully Updated!"})
                    done(err)
                })
        })
    })
*/

  describe("DELETE /users/:userID", () => {

    describe("when the user id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .delete("/users/9999")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message: "user NOT Successfully Deleted!",
            errmsg:
                            {
                              message:
                                    "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"User\"",
                              name: "CastError",
                              stringValue: "\"9999\"",
                              kind: "ObjectId",
                              value: "9999",
                              path: "_id"
                            }
          }, (err, res) => {
            done(err)
          })
      })
    })


  })
})
