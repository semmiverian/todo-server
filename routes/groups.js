const router = require('express').Router()
const Group = require('../models/group')
const User = require('../models/user')

const isLogin = require('../middlewares/isLogin')

router.post('/', async (req, res) => {
  const invitations = await User.find({_id: {$in: req.body.invitations}}).exec()

  const group = await Group.create({
    name: req.body.name,
    teams: {_id: invitations.map(user => user.id)},
    owner: req.decoded.id
  })

  await User.update(
    {
      _id: req.decoded.id
    },
    {
      $push: {
        groups: group.id
      }
    }
  ).exec()

  invitations.forEach(async user => {
    await user
      .update({
        $push: {
          notifications: {
            name: 'Group Invitation',
            description: `${req.decoded.email} invite you to join ${group.name} team`,
            payload: {
              group: group
            }
          }
        }
      })
      .exec()
  })

  res.status(201).json({
    message: 'Successfully creating new group',
    group
  })
})

router.post('/:id/accept', isLogin, async (req, res) => {
  try {
    const group = await Group.findOneAndUpdate(
      {
        _id: req.params.id,
        teams: {$elemMatch: {_id: req.decoded.id}}
      },
      {'teams.$.accepted': true},
      {new: true}
    ).exec()

    res.status(200).json({
      message: 'Successfully accepting invitation',
      group
    })
  } catch (e) {
    res.status(500).json({message: e})
  }
})

module.exports = router
