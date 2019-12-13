let mongoose = require("../routes/db")
const Schema = require("mongoose")

let TrackingSchema = new mongoose.Schema({
  projectName: {type: String, default: "project name"},
  stages: {
    type: Array,
    default: ["stage 1: AAAAAAAAAA", "stage 2: BBBBBBBBBB", "stage 3: CCCCCCCCCC"]
  },
  stagesNum: {type: Number, default: 3},
  status: {type: String, default: "processing"},

  teamsID: [{type: Schema.Types.ObjectId, ref: "User"}],
  teamsNum: {type: Number, default: 0},

  tasksID: [{type: Schema.Types.ObjectId, ref: "Task"}],
  tasksNum: {type: Number, default: 0},

  createdTime: String,
  lastModifiedTime: String,
  deleteTime: {type: String, default: "xxxx-xx-xx xx:xx:xx"},
},
{collection: "tracings"})

module.exports = mongoose.model("Tracing", TrackingSchema)