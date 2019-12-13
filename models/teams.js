let mongoose = require("../routes/db")
const Schema = mongoose.Schema

let TeamSchema = new mongoose.Schema({
  teamName: {type: String, default: "team name"},
  teamMembersID: [{type: Schema.Types.ObjectId, ref: "User"}],
  memberNum: {type: Number},
  status: {type: String, default: "on"},

  tasksID: [{type: Schema.Types.ObjectId, ref: "Task"}],
  tasksNum: {type: Number, default: 0},

  projectID: {type: Schema.Types.ObjectId, ref: "Tracing"},

  createdTime: String,
  lastModifiedTime: String,
  dismissTime: {type: String, default: "xxxx-xx-xx xx:xx:xx"},
},
{collection: "teams"})

module.exports = mongoose.model("Team", TeamSchema)