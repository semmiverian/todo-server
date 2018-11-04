const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Encryption = require('../helpers/encryption')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  todos: [{type: Schema.Types.ObjectId, ref: 'todo'}],
  groups: [{type: Schema.Types.ObjectId, ref: 'group'}],
  categories: [{type: Schema.Types.ObjectId, ref: 'category'}],
  notifications: {
    name: {type: String},
    description: {type: String},
    payload: {type: Object},
    status: {type: String, default: 'unread'}
  }
})

UserSchema.pre('save', function(next) {
  this.password = Encryption.encrypt(this.password)
  next()
})

const User = mongoose.model('user', UserSchema)

module.exports = User
