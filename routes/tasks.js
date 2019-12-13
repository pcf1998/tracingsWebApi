var express = require('express');
let Task = require('../models/tasks');
let Tracing = require('../models/tracings');
let Team = require('../models/teams');
let sd = require('silly-datetime');

var router = express.Router();

//find all tasks in the project
router.findAllInProject = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json(err);
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else
                return res.json(tracing.tasksID);
        }
    });
};

//find one task in the project
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
                Task.findById(req.params.taskID, function (err, task) {
                    if (err)
                        return res.json(err);
                    else {
                        if (task == null) {
                            return res.json({message: "task NOT Found!"});
                        } else
                            return res.json(task);
                    }
                });
            }
        }
    });
};

//find all tasks in the team
router.findAllInTeam = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json(err);
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
                            return res.json(team.tasksID);
                    }
                });

            }
        }
    });
};

//find one tasks in the team
router.findOneInTeam = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json(err);
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
                            Task.findById(req.params.taskID, function (err, task) {
                                if (err)
                                    return res.json(err);
                                else {
                                    if (task == null) {
                                        return res.json({message: "task NOT Found!"});
                                    } else
                                        return res.json(task);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};

//add task
router.addTask = (req, res) => {

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
                    // return a suitable error message
                    else {
                        if (team == null) {
                            return res.json({message: "team NOT Found!"});
                        } else {
                            let task = new Task();

                            task.taskName = req.body.taskName;
                            task.membersID = req.body.membersID;
                            task.taskContent = req.body.taskContent

                            task.projectID = tracing._id;
                            task.teamID = team._id;

                            let nowTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                            task.createdTime = nowTime;
                            task.lastModifiedTime = nowTime;

                            task.save(function (err) {
                                if (err)
                                    return res.json({message: "task NOT Successfully Added!", errmsg: err});
                                else {
                                    team.tasksID.push(task._id);
                                    team.tasksNum = team.tasksNum + 1;
                                    team.lastModifiedTime = nowTime;

                                    team.save(function (err) {
                                        if (err)
                                            return res.json({
                                                message: "task Successfully Added BUT NOT added to team!!!",
                                                errmsg: err
                                            });
                                        else {
                                            tracing.tasksID.push(task._id);
                                            tracing.tasksNum = tracing.tasksNum + 1;
                                            tracing.lastModifiedTime = nowTime;

                                            tracing.save(function (err) {
                                                if (err)
                                                    return res.json({
                                                        message: "task Successfully Added to team BUT NOT added to project!!!",
                                                        errmsg: err
                                                    });
                                                else
                                                    return res.json({message: 'task Successfully Added!', data: task});
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                });
            }
        }
    });
};

//update task content
router.updateTaskContent = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json({message: "Project NOT Found!", errmsg: err});
        // return a suitable error message
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                Task.findById(req.params.taskID, function (err, task) {
                    if (err)
                        return res.json({message: "task NOT Found!", errmsg: err});
                    else {
                        if (task == null) {
                            return res.json({message: "task NOT Found!"});
                        } else {
                            //task.taskName = req.body.taskName;
                            task.taskContent = req.body.taskContent;
                            //task.status = req.body.status;

                            task.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                            task.save(function (err) {
                                if (err)
                                    return res.json({message: "task content NOT Successfully Update!", errmsg: err});
                                else
                                    return res.json({message: 'task content Successfully Update!', data: task});
                            })
                        }
                    }
                })
            }
        }
    });
};

//update task name
router.updateTaskName = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json({message: "Project NOT Found!", errmsg: err});
        // return a suitable error message
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                Task.findById(req.params.taskID, function (err, task) {
                    if (err)
                        return res.json({message: "task NOT Found!", errmsg: err});
                    else {
                        if (task == null) {
                            return res.json({message: "task NOT Found!"});
                        } else {
                            task.taskName = req.body.taskName;
                            //task.taskContent = req.body.taskContent;
                            //task.status = req.body.status;

                            task.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                            task.save(function (err) {
                                if (err)
                                    return res.json({message: "task name NOT Successfully Update!", errmsg: err});
                                else
                                    return res.json({message: 'task name Successfully Update!', data: task});
                            })
                        }
                    }
                })
            }
        }
    });
};

//update task status
router.updateTaskStatus = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json({message: "Project NOT Found!", errmsg: err});
        // return a suitable error message
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                Task.findById(req.params.taskID, function (err, task) {
                    if (err)
                        return res.json({message: "task NOT Found!", errmsg: err});
                    else {
                        if (task == null) {
                            return res.json({message: "task NOT Found!"});
                        } else {
                            //task.taskName = req.body.taskName;
                            //task.taskContent = req.body.taskContent;
                            task.status = req.body.status;

                            task.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                            task.save(function (err) {
                                if (err)
                                    return res.json({message: "task status NOT Successfully Update!", errmsg: err});
                                else
                                    return res.json({message: 'task status Successfully Update!', data: task});
                            })
                        }
                    }
                })
            }
        }
    });
};

//delete task
router.deleteTask = (req, res) => {

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
                    // return a suitable error message
                    else {
                        if (team == null) {
                            return res.json({message: "team NOT Found!"});
                        } else {
                            Task.findByIdAndRemove(req.params.taskID, function (err) {
                                if (err)
                                    return res.json({message: "task NOT Successfully Deleted!", errmsg: err});
                                else {
                                    team.tasksID.remove(req.params.taskID);
                                    team.tasksNum = team.tasksNum - 1;
                                    if (team.tasksNum < 0) {
                                        team.tasksNum = 0;
                                    }
                                    team.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                                    team.save(function (err) {
                                        if (err)
                                            return res.json({
                                                message: "task delete BUT team did NOT delete the task ID!",
                                                errmsg: err
                                            });
                                        else {
                                            tracing.tasksID.remove(req.params.taskID);
                                            tracing.tasksNum = tracing.tasksNum - 1;
                                            if (tracing.tasksNum < 0) {
                                                tracing.tasksNum = 0;
                                            }
                                            tracing.lastModifiedTime = team.lastModifiedTime;

                                            tracing.save(function (err) {
                                                if (err)
                                                    return res.json({
                                                        message: "task deleted and team delete the task ID BUT project NOT !",
                                                        errmsg: err
                                                    });
                                                else
                                                    return res.json({message: 'task Successfully Deleted!'});
                                            })
                                        }
                                    })
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};


module.exports = router;
