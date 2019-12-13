var express = require('express');
let Tracing = require('../models/tracings');
let sd = require('silly-datetime');

let router = express.Router();

//find all tracings
router.findAll = (req, res) => {
    // Return a JSON representation of tracings list
    res.setHeader('Content-Type', 'application/json');

    Tracing.find(function (err, tracings) {
        if (err)
            return res.json(err);
        else {
            if (tracings == null) {
                return res.json({message: "No Projects"});
            } else
                return res.json(tracings);
        }
    });
};

//find one tracing
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json(err);
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else
            //return res.json({data:tracing});
                res.send(JSON.stringify(tracing, null, 5))
        }
    });
};

//add tracing
router.addTracing = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    let tracing = new Tracing();

    // the requested value
    tracing.projectName = req.body.projectName;
    //tracing.stages = req.body.stages;
    //tracing.stagesNumber = req.body.stagesNumber;
    tracing.status = req.body.status;
    //tracing.teamsID = req.body.teamsID;
    //tracing.teamsNum = req.body.teamsNum;
    //tracing.tasksID = req.body.tasksID;
    //tracing.tasksNum = req.body.tasksNum;

    let nowTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    tracing.createdTime = nowTime;
    tracing.lastModifiedTime = nowTime;

    tracing.save(function (err) {
        if (err)
            return res.json({message: "Tracing NOT Successfully Added!", errmsg: err});
        // return a suitable error message
        else
            return res.json({message: 'Tracing Successfully Added!', data: tracing});
        // return a suitable success message
    });
};

//update project
router.updateProject = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json(err);
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {

                let originalProjectName = tracing.projectName;
                let newProjectName = req.body.projectName;

                let originalStatus = tracing.status;
                let newStatus = req.body.status;

                if (req.body.projectName == null) {
                    newProjectName = originalProjectName;
                }
                if (req.body.status == null) {
                    newStatus = originalStatus;
                }

                tracing.projectName = newProjectName;
                tracing.status = newStatus;

                tracing.stagesNum = tracing.stages.length;
                tracing.teamsNum = tracing.teamsID.length;
                tracing.tasksNum = tracing.tasksID.length;

                //update last modified time
                tracing.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                tracing.save(function (err) {
                    if (err)
                        return res.json({message: "project NOT Successfully Updated!", errmsg: err});
                    // return a error message
                    else
                        return res.json({message: 'project Successfully Updated!', data: tracing});
                    // return a success message
                })

            }
        }
    });
};

//update project status
/*
router.updateProjectStatus = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json(err);
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                let originalStatus = tracing.status;
                let newStatus = req.body.status;

                if (originalStatus === newStatus) {
                    return res.json({message: "original status and new status can't be same!"});
                } else {
                    tracing.status = newStatus;

                    tracing.stagesNum = tracing.stages.length;
                    tracing.teamsNum = tracing.teamsID.length;
                    tracing.tasksNum = tracing.tasksID.length;

                    //update last modified time
                    tracing.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                    tracing.save(function (err) {
                        if (err)
                            return res.json({message: "project status NOT Successfully Updated!", errmsg: err});
                        // return a error message
                        else
                            return res.json({message: 'project status Successfully Updated!', data: tracing});
                        // return a success message
                    })
                }
            }
        }
    });
};
*/

//modify stage
router.updateStage = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            return res.json(err);
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                let indexOfStage = req.params.whichStageToModify - 1;
                if (indexOfStage < 0 || indexOfStage >= tracing.stagesNum) {
                    return res.json({message: "can NOT find the stage !!!"});
                } else {
                    tracing.stages[indexOfStage] = req.body.stages;
                    tracing.markModified('stages');

                    //update last modified time
                    tracing.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                    tracing.save(function (err) {
                        if (err)
                            return res.json({message: "stage NOT Successfully Modified!", errmsg: err});
                        // return a suitable error message
                        else
                            return res.json({message: 'stage Successfully Modified!', data: tracing});
                        // return a suitable success message
                    })
                }
            }
        }
    });
};

//add stages
router.addStages = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            res.json(err);
        else {

            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                let originalNumOfStages = tracing.stagesNum;
                let addedStages = req.body.stages;
                let numAddedStages = addedStages.length;

                if (numAddedStages > 0) {
                    for (let i = 0; i < numAddedStages; i++) {
                        tracing.stages.push(addedStages[i]);
                    }
                } else {
                    return res.json({message: "the number of added stages can't be 0 !"});
                }

                let newNumOfStages = tracing.stages.length;
                if (originalNumOfStages === newNumOfStages) {
                    return res.json({message: "stage NOT Added!"});
                } else {
                    //update last modified time
                    tracing.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                    tracing.stagesNum = tracing.stages.length;

                    tracing.save(function (err) {
                        if (err)
                            return res.json({message: "stages NOT Successfully Added!", errmsg: err});
                        // return a suitable error message
                        else
                            return res.json({message: 'stages Successfully Added!', data: tracing.stages});
                        // return a suitable success message
                    })
                }
            }
        }
    });
};

//delete tracing
router.deleteTracing = (req, res) => {

    Tracing.findByIdAndRemove(req.params.projectID, function (err) {
        if (err)
            return res.json({message: "project NOT Successfully Deleted!", errmsg: err});
        else
            return res.json({message: 'project Successfully Deleted!'});
    });
};

function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

//delete stage
router.deleteStage = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Tracing.findById(req.params.projectID, function (err, tracing) {
        if (err)
            res.json(err);
        else {
            if (tracing == null) {
                return res.json({message: "project NOT Found!"});
            } else {
                if (isNumber(req.params.whichStageToDelete) === false) {
                    return res.json({message: "which Stage To Delete MUST be a legal NUMBER"});
                } else {
                    let indexOfStage = req.params.whichStageToDelete - 1;
                    if (indexOfStage < 0 || indexOfStage >= tracing.stagesNum) {
                        return res.json({message: "can NOT find the stage !!!"});
                    } else {
                        tracing.stages.splice(indexOfStage, 1);

                        //update stageNum
                        tracing.stagesNum = tracing.stagesNum - 1;
                        if (tracing.stagesNum < 0) {
                            tracing.stagesNum = 0;
                        }

                        //update last modified time
                        tracing.lastModifiedTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

                        tracing.save(function (err) {
                            if (err)
                                return res.json({message: "stage NOT Successfully Deleted!", errmsg: err});
                            // return a suitable error message
                            else
                                return res.json({message: 'stage Successfully Deleted!', data: tracing});
                            // return a suitable success message
                        })
                    }
                }
            }
        }
    });
};

/*function getTotalOperationsNum(array) {
    let totalOperationsNum = 0;
    array.forEach(function (obj) {
        totalOperationsNum += obj.operationsNum;
    });
    return totalOperationsNum;
}*/

//find Total Operations Number
/*
router.findTotalOperationsNum = (req, res) => {
    Tracing.find(function (err, tracings) {
        if (err)
            return res.json({message: "Something Went Wrong!", errmsg: err});
        // return a suitable error message
        else {
            let operationsNum = getTotalOperationsNum(tracings);
            return res.json({totalOperationsNum: operationsNum});
            // return the total operations number
        }
    });
};
*/

//find Operations Number
/*router.findOperationsNum = (req, res) => {

    Tracing.findById(req.params.id, function (err, tracing) {
        if (err)
            return res.send(JSON.stringify(err, null, 5));
        else {
            let operationsNum = tracing.operationsNum;
            return res.json({operationsNum: operationsNum});
        }
    });
};*/

module.exports = router;
