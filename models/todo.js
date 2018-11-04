const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    default: 'incomplete'
  },
  belongsTo: {
    type: Schema.Types.ObjectId,
    refPath: 'type'
  },
  type: {
    type: String
  }
})

const Todo = mongoose.model('todo', todoSchema)

module.exports = Todo
