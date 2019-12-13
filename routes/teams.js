var express = require('express');
let Tracing = require('../models/tracings');
let Team = require('../models/teams');
let sd = require('silly-datetime');

var router = express.Router();

//find all teams
router.findAll = (req, res) => {
    // Return a JSON representation of tracings list
    res.setHeader('Content-Type', 'application/json');

    Team.find(function (err, teams) {
        if (err)
            return res.json(err);
        return res.json(teams);
    });
};

//find one team
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Team.findById(req.params.teamID, function (err, team) {
        if (err)
            return res.json(err);
        else {
            if (team == null) {
                return res.json({message: "team NOT Found!"});
            } else
                return res.json(team);
        }
    });
};

//find all teams in the project
router.findAllInProject = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json(err);
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                return res.json(tracing.teamsID);
            }
        }
    });
};

//find one team in the project
router.findOneInProject = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json({message: "Project NOT Found!", errmsg: err});
        // return a suitable error message
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                Team.findById(req.params.teamID, function (err, team) {
                    if (err)
                        return res.json(err);
                    else {
                        if (team == null) {
                            return res.json({message: "team NOT Found!"});
                        } else
                            return res.json(team);
                    }
                });
            }
        }
    });
};

//add team
router.addTeam = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json(err);
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                let team = new Team();

                // the requested value
                team.teamName = req.body.teamName;
                team.teamMembersID = req.body.teamMembersID;


                team.memberNum = req.body.teamMembersID.length;
                team.projectID = tracing._id;

                let nowTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                team.createdTime = nowTime;
                team.lastModifiedTime = nowTime;

                team.save(function (err) {
                    if (err)
                        return res.json({message: "team NOT Successfully Added!", errmsg: err});
                    // return a suitable error message
                    else {
                        tracing.teamsID.push(team._id);
                        tracing.teamsNum = tracing.teamsID.length;
                        tracing.lastModifiedTime = nowTime;

                        tracing.save(function (err) {
                            if (err)
                                return res.json({message: "team Added BUT project NOT Updated!", errmsg: err});
                            else
                                return res.json({message: 'team Successfully Added!', data: team});
                            // return a suitable success message
                        })
                    }
                });
            }
        }
    });
};

//add team members ID
router.addTeamMembersID = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            res.json(err);
        else {

            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                Team.findById(req.params.teamID, function (err, team) {
                    if (err)
                        return res.json(err);
                    else {
                        if (team == null) {
                            return res.json({message: "team NOT Found!"});
                        } else {

                            let originalNumOfTeamMembers = team.memberNum;
                            let addedTeamMembersID = req.body.teamMembersID;
                            let numAddedTeamMembersID = addedTeamMembersID.length;

                            if (numAddedTeamMembersID > 0) {
                                for (let i = 0; i < numAddedTeamMembersID; i++) {
                                    team.teamMembersID.push(addedTeamMembersID[i]);
                                }
                            } else {
                                return res.json({message: "the number of added team Members ID can't be 0 !"});
                            }

                            let newNumOfTeamMembersID = team.teamMembersID.length;
                            if (originalNumOfTeamMembers === newNumOfTeamMembersID) {
                                return res.json({message: "team Members ID NOT Added!"});
                            } else {
                                //update last modified time
                                team.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                                team.memberNum = team.teamMembersID.length;

                                team.save(function (err) {
                                    if (err)
                                        return res.json({
                                            message: "team Members ID NOT Successfully Added!",
                                            errmsg: err
                                        });
                                    // return a suitable error message
                                    else
                                        return res.json({message: 'team Members ID Successfully Added!', data: team});
                                    // return a suitable success message
                                })
                            }
                        }
                    }
                });
            }
        }
    });
};

//update team name
router.updateTeamName = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json({message: "Project NOT Found!", errmsg: err});
        // return a suitable error message
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                Team.findById(req.params.teamID, function (err, team) {
                    if (err)
                        return res.json({message: "team NOT Found!", errmsg: err});
                    else {
                        if (team == null) {
                            return res.json({message: "team NOT Found!"});
                        } else {
                            team.teamName = req.body.teamName;

                            team.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                            team.save(function (err) {
                                if (err)
                                    return res.json({message: "team name NOT Successfully Update!", errmsg: err});
                                else
                                    return res.json({message: 'team name Successfully Update!', data: team});
                            })
                        }
                    }
                })
            }
        }
    });
};

router.updateTeamStatus = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json({message: "Project NOT Found!", errmsg: err});
        // return a suitable error message
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                Team.findById(req.params.teamID, function (err, team) {
                    if (err)
                        return res.json({message: "team NOT Found!", errmsg: err});
                    else {
                        if (team == null) {
                            return res.json({message: "team NOT Found!"});
                        } else {
                            team.status = req.body.status;

                            team.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                            team.save(function (err) {
                                if (err)
                                    return res.json({message: "team status NOT Successfully Update!", errmsg: err});
                                else
                                    return res.json({message: 'team status Successfully Update!', data: team});
                            })
                        }
                    }
                })
            }
        }
    });
};

//update team member ID
router.updateTeamMemberID = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json({message: "Project NOT Found!", errmsg: err});
        // return a suitable error message
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                Team.findById(req.params.teamID, function (err, team) {
                    if (err)
                        return res.json({message: "team NOT Found!", errmsg: err});
                    else {
                        if (team == null) {
                            return res.json({message: "team NOT Found!"});
                        } else {
                            let indexOfTeamMemberID = req.params.whichTeamMemberIDToUpdate - 1;
                            if (indexOfTeamMemberID < 0 || indexOfTeamMemberID >= team.memberNum) {
                                return res.json({message: "can NOT find the team member ID !!!"});
                            } else {
                                team.teamMembersID[indexOfTeamMemberID] = req.body.teamMembersID;
                                team.markModified('teamMembersID');

                                //update last modified time
                                team.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                                team.save(function (err) {
                                    if (err)
                                        return res.json({
                                            message: "team member ID NOT Successfully Modified!",
                                            errmsg: err
                                        });
                                    // return a suitable error message
                                    else
                                        return res.json({message: 'team member ID Successfully Modified!', data: team});
                                    // return a suitable success message
                                })
                            }
                        }
                    }
                })
            }
        }
    });
};

//delete team
router.deleteTeam = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json({message: "Project NOT Found!", errmsg: err});
        // return a suitable error message
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {

                Team.findById(req.params.teamID, function (err, team) {
                    if (err)
                        return res.json(err);
                    else {
                        if (team == null) {
                            return res.json({message: "team NOT Found!"});
                        } else {
                            if (team.tasksNum === 0) {
                                Team.findByIdAndRemove(req.params.teamID, function (err) {
                                    if (err)
                                        return res.json({message: "team NOT Successfully Deleted!", errmsg: err});
                                    else {
                                        tracing.teamsID.remove(req.params.teamID);
                                        tracing.teamsNum = tracing.teamsNum - 1;
                                        if (tracing.teamsNum < 0) {
                                            tracing.teamsNum = 0;
                                        }
                                        tracing.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                                        tracing.save(function (err) {
                                            if (err)
                                                return res.json({
                                                    message: "team delete BUT project did NOT delete the team ID!",
                                                    errmsg: err
                                                });
                                            else {
                                                return res.json({message: 'team Successfully Deleted!'});
                                            }
                                        })

                                    }
                                });
                            } else {
                                return res.json({message: "Team can NOT be deleted, existing tasks in this team"})
                            }
                        }
                    }
                });

            }
        }
    });
};

//delete team member ID
router.deleteTeamMemberID = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json({message: "Project NOT Found!", errmsg: err});
        // return a suitable error message
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                Team.findById(req.params.teamID, function (err, team) {
                    if (err)
                        return res.json({message: "team NOT Found!", errmsg: err});
                    else {
                        if (team == null) {
                            return res.json({message: "team NOT Found!"});
                        } else {
                            team.teamMembersID.remove(req.params.teamMemberID);
                            team.memberNum = team.memberNum - 1;
                            if (team.memberNum < 0) {
                                team.memberNum = 0;
                            }
                            team.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                            team.save(function (err) {
                                if (err)
                                    return res.json({
                                        message: "team member ID delete BUT team did NOT delete the team Member ID!",
                                        errmsg: err
                                    });
                                else {
                                    return res.json({message: 'team member ID Successfully Deleted!'});
                                }
                            })
                        }
                    }
                })
            }
        }
    });
};

module.exports = router;
