const chai = require("chai")
const server = require("../../../bin/www")
const expect = chai.expect
const request = require("supertest")
let mongoose = require("../../../routes/db")

describe("Team", () => {

  describe("GET /teams", () => {
    it("should return all the teams", done => {
      request(server)
        .get("/teams")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array")
          done(err)
        })
    })
  })

  describe("GET /teams/:teamID", () => {

    describe("when the team id is valid", () => {
      it("should return the matching team", done => {
        request(server)
          .get("/teams/5dee5fb808673d10f5142dd0")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.deep.include({_id: "5dee5fb808673d10f5142dd0"})
            done(err)
          })
      })
    })

    describe("when the team id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .get("/teams/9999")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message:
                            "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"Team\"",
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

  describe("GET /tracings/:projectID/teams/", () => {

    describe("when the project id is valid", () => {
      it("should return all teams in the project", done => {
        request(server)
          .get("/tracings/5db57b543e7f3c0666c9c0b9/teams/")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.be.a("array")
            done(err)
          })
      })
    })

    describe("when the project id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .get("/tracings/9999/teams/")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message:
                            "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"Tracing\"",
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

  describe("GET /tracings/:projectID/teams/:teamID", () => {

    describe("when the project id and team id are valid", () => {
      it("should return the matching team in the project", done => {
        request(server)
          .get("/tracings/5db57b543e7f3c0666c9c0b9/teams/5dee5fb808673d10f5142dd0")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.deep.include({_id: "5dee5fb808673d10f5142dd0"})
            done(err)
          })
      })
    })

    describe("when the project id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .get("/tracings/9999/teams/5dee5fb808673d10f5142dd0")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message: "Project NOT Found!",
            errmsg:
                            {
                              message:
                                    "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"Tracing\"",
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

    describe("when the team id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .get("/tracings/5db57b543e7f3c0666c9c0b9/teams/9999")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message:
                            "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"Team\"",
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

  describe("POST /tracings/:projectID/teams", () => {

    describe("when the project id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .post("/tracings/9999/teams")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message:
                            "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"Tracing\"",
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

  describe("POST /tracings/:projectID/teams/:teamID/teamMembersID", () => {

    describe("when the project id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .post("/tracings/9999/teams/5db5d622aa962a17eaf9ccb1/teamMembers")
          .set("Accept", "application/json")
          .expect("Content-Type", "text/html; charset=utf-8")
          .expect(404)
          .expect({}, (err, res) => {
            done(err)
          })
      })
    })

    describe("when the team id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .post("/tracings/5db57b543e7f3c0666c9c0b9/teams/9999/teamMembers")
          .set("Accept", "application/json")
          .expect("Content-Type", "text/html; charset=utf-8")
          .expect(404)
          .expect({}, (err, res) => {
            done(err)
          })
      })
    })


  })

  describe("PUT /tracings/:projectID/teams/:teamID/teamName", () => {
    it("should return confirmation message and update team name", done => {
      request(server)
        .put("/tracings/5db57b543e7f3c0666c9c0b9/teams/5dee5fb808673d10f5142dd0/teamName")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .send({teamName: "team000-test"})
        .expect(200)
        .end((err, res) => {
          expect({message: "team name Successfully Update!"})
          done(err)
        })
    })
  })

  describe("PUT /tracings/:projectID/teams/:teamID/teamMembersID/:whichTeamMemberIDToUpdate", () => {

    describe("when project id, team members id and index of the team member are valid", () => {
      it("should return confirmation message and update team member id", done => {
        request(server)
          .put("/tracings/5db57b543e7f3c0666c9c0b9/teams/5dee5fb808673d10f5142dd0/teamMembersID/1")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .send({teamMembersID: "5db5785c3e7f3c0666c9c0af"})
          .expect(200)
          .end((err, res) => {
            expect({message: "team member ID Successfully Modified!"})
            done(err)
          })
      })
    })

    describe("when project id, team members id are valid and index of team member id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .put("/tracings/5db57b543e7f3c0666c9c0b9/teams/5dee5fb808673d10f5142dd0/teamMembersID/9999")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .send({teamMembersID: "5db5785c3e7f3c0666c9c0af"})
          .expect(200)
          .end((err, res) => {
            expect({message: "can NOT find the team member ID !!!"})
            done(err)
          })
      })
    })


  })

  describe("DELETE /tracings/:projectID/teams/:teamID", () => {


    describe("when the project id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .delete("/tracings/9999/teams/5dee5fb808673d10f5142dd0")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({message: "Project NOT Found!"}, (err, res) => {
            done(err)
          })
      })
    })

    describe("when the team id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .delete("/tracings/5db57b543e7f3c0666c9c0b9/teams/9999")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message:
                            "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"Team\"",
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

  describe("DELETE /tracings/:projectID/teams/:teamID/teamMembersID/:teamMemberID", () => {

    describe("when the project id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .delete("/tracings/9999/teams/5dee5fb808673d10f5142dd0/teamMembersID/5db5785c3e7f3c0666c9c0af")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message: "Project NOT Found!",
            errmsg:
                            {
                              message:
                                    "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"Tracing\"",
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

    describe("when the team id is invalid", () => {
      it("should return the NOT found message", done => {
        request(server)
          .delete("/tracings/5db57b543e7f3c0666c9c0b9/teams/9999/teamMembersID/5db5785c3e7f3c0666c9c0af")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message: "team NOT Found!",
            errmsg:
                            {
                              message:
                                    "Cast to ObjectId failed for value \"9999\" at path \"_id\" for model \"Team\"",
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
