const router = require('express').Router()
const Todo = require('../models/todo')
const User = require('../models/user')

router.get('/', async (req, res) => {
  const user = await User.findById(req.decoded.id)
    .populate({
      path: 'todos',
      match: {status: 'incomplete', belongsTo: req.body.belongsTo},
      populate: {path: 'belongsTo'}
    })
    .populate('categories')
    .populate({
      path: 'groups',
      populate: {path: 'teams._id', select: 'email'}
    })
    .exec()

  res.status(200).json(user)
})

router.post('/', async (req, res) => {
  const {title, description, deadline, type, belongsTo} = req.body
  const todo = await Todo.create({
    title,
    description,
    deadline: new Date(deadline),
    type,
    belongsTo
  })

  await User.update({
    $push: {
      todos: todo.id
    }
  })

  res.status(201).json({
    message: 'Succesfully creating todo'
  })
})

router.patch('/complete/:id', async (req, res) => {
  await Todo.update(
    {
      _id: req.params.id
    },
    {
      status: 'complete'
    }
  ).exec()

  res.status(200).json({
    message: 'Succesfully compliting a todo'
  })
})

router.delete('/:id', async (req, res) => {
  await Todo.delete({_id: req.params.id})

  res.status(200).json({
    message: 'Succesfully deleting todo'
  })
})

router.put('/:id', async (req, res) => {
  const newTodo = await Todo.findOneAndUpdate(
    {
      _id: req.parasms.id
    },
    req.body,
    {new: true}
  )

  res.status(200).json({
    message: 'Succesfully updating todo',
    todo: newTodo
  })
})

module.exports = router
