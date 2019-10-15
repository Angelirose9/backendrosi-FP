const mongoose = require('mongoose')

// DB Option
const dbUrl = "mongodb+srv://rosyana:rosyana@cluster0-nizsa.mongodb.net/test"
const dbOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.Promise = global.Promise
mongoose.connect(dbUrl, dbOption)

module.exports = {
  mongoose: mongoose
}