let mongoose = require("../routes/db")
const bcrypt = require("bcrypt")
const SALT_WORK_FACTOR = 10

let UserSchema = new mongoose.Schema({
  userName: {type: String, default: "username"},
  userPassword: String,
  status: {type: String, default: "on"},
  authority: {type: Number, default: 1},

  department: {type: String, default: "Marketing"},
  position: {type: String, default: "staff"},

  email: String,
  mobilePhone: String,
  fax: String,
  telephone: String,
  address: String,

  gender: {type: String, default: "male"},
  dateOfBirth: String,
  age: Number,
  educationalDegree: {type: String, default: "bachelor"},
  maritalStatus: {type: String, default: "single"},

  lastModifiedTime: String,
  entryDate: String,
  yearsOfWork: Number,
  leaveDate: {type: String, default: "xxxx-xx-xx"}
},
{collection: "users"})

UserSchema.pre("save", function (next) {
  let user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("userPassword")) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)

    // hash the password using our new salt
    bcrypt.hash(user.userPassword, salt, function (err, hash) {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.userPassword = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.userPassword, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

module.exports = mongoose.model("User", UserSchema)