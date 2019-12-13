var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const tracings = require('./routes/tracings');
const users = require('./routes/users');
const teams = require('./routes/teams');
const tasks = require('./routes/tasks');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(cors());

//log in
app.post('/login', users.login);

//for users
app.get('/users', users.findAll);
app.get('/users/:userID', users.findOne);
//for tracings
app.get('/tracings', tracings.findAll);
app.get('/tracings/:projectID', tracings.findOne);
//for tasks
app.get('/tracings/:projectID/tasks', tasks.findAllInProject);
app.get('/tracings/:projectID/tasks/:taskID', tasks.findOneInProject);
app.get('/tracings/:projectID/teams/:teamID/tasks/', tasks.findAllInTeam);
app.get('/tracings/:projectID/teams/:teamID/tasks/:taskID', tasks.findOneInTeam);
//for teams
app.get('/teams', teams.findAll);
app.get('/teams/:teamID', teams.findOne);
app.get('/tracings/:projectID/teams/', teams.findAllInProject);
app.get('/tracings/:projectID/teams/:teamID', teams.findOneInProject);


//for users
app.post('/users', users.addUser);
//for tracings
app.post('/tracings', tracings.addTracing);
app.post('/tracings/:projectID/stages', tracings.addStages);
//for tasks
app.post('/tracings/:projectID/teams/:teamID/tasks', tasks.addTask);
//for teams
app.post('/tracings/:projectID/teams', teams.addTeam);
app.post('/tracings/:projectID/teams/:teamID/teamMembersID', teams.addTeamMembersID);


//for users
app.put('/users/:userID/userName', users.updateUserName);
app.put('/users/:userID/userPassword', users.updateUserPassword);
app.put('/users/:userID/status', users.updateStatus);
app.put('/users/:userID/department', users.updateDepartment);
app.put('/users/:userID/position', users.updatePosition);
app.put('/users/:userID/email', users.updateEmail);
app.put('/users/:userID/mobilePhone', users.updateMobilePhone);
app.put('/users/:userID/fax', users.updateFax);
app.put('/users/:userID/telephone', users.updateTelephone);
app.put('/users/:userID/address', users.updateAddress);
app.put('/users/:userID/gender', users.updateGender);
app.put('/users/:userID/dateOfBirth', users.updateDateOfBirth);
app.put('/users/:userID/educationalDegree', users.updateEducationalDegree);
app.put('/users/:userID/maritalStatus', users.updateMaritalStatus);
app.put('/users/:userID/entryDate', users.updateEntryDate);
app.put('/users/:userID/leave', users.updateLeave);
//for tracings
app.put('/tracings/:projectID', tracings.updateProject);
app.put('/tracings/:projectID/stages/:whichStageToModify', tracings.updateStage);
//for tasks
app.put('/tracings/:projectID/teams/:teamID/tasks/:taskID/taskContent', tasks.updateTaskContent);
app.put('/tracings/:projectID/teams/:teamID/tasks/:taskID/taskName', tasks.updateTaskName);
app.put('/tracings/:projectID/teams/:teamID/tasks/:taskID/taskStatus', tasks.updateTaskStatus);
//for teams
app.put('/tracings/:projectID/teams/:teamID/teamName', teams.updateTeamName);
app.put('/tracings/:projectID/teams/:teamID/teamStatus', teams.updateTeamStatus);
app.put('/tracings/:projectID/teams/:teamID/teamMembersID/:whichTeamMemberIDToUpdate', teams.updateTeamMemberID);


//for users
app.delete('/users/:userID', users.deleteUser);
//for tracings
app.delete('/tracings/:projectID', tracings.deleteTracing);
app.delete('/tracings/:projectID/stages/:whichStageToDelete', tracings.deleteStage);
//for tasks
app.delete('/tracings/:projectID/teams/:teamID/tasks/:taskID', tasks.deleteTask);
//for teams
app.delete('/tracings/:projectID/teams/:teamID', teams.deleteTeam);
app.delete('/tracings/:projectID/teams/:teamID/teamMembersID/:teamMemberID', teams.deleteTeamMemberID);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
