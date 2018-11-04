const mongoose = require('mongoose')

module.exports = _ => {
  return mongoose.connect(
    'mongodb://localhost:27018/todo',
    {useNewUrlParser: true}
  )
}
