const router = require('express').Router()
const User = require('../models/user')
const Category = require('../models/category')

router.post('/', async (req, res) => {
  const category = await Category.create({
    name: req.body.name
  })

  await User.update(
    {
      _id: req.decoded.id
    },
    {
      $push: {
        categories: category.id
      }
    }
  )

  res.status(201).json({
    message: 'Succesfully creating new todo category'
  })
})
module.exports = router
