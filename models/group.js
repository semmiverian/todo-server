const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
  name: String,
  teams: [
    {
      _id: {type: Schema.Types.ObjectId, ref: 'user'},
      accepted: {type: Boolean, default: false}
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Group = mongoose.model('group', GroupSchema)

module.exports = Group
