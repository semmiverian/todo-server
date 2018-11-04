var express = require('express')
var router = express.Router()
const User = require('../models/user')
const Category = require('../models/category')
const Encryption = require('../helpers/encryption')
const jwt = require('../helpers/jwt')
const isLogin = require('../middlewares/isLogin')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

router.post('/', async (req, res) => {
  const category = await Category.create({name: 'Default'})
  const user = await User.create({
    email: req.body.email,
    password: req.body.password,
    categories: [category.id]
  })

  res.status(201).json({user})
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({email: req.body.email}).catch(e => {
    res.status(500).json(err)
  })

  if (user) {
    if (Encryption.compare(req.body.password, user.password)) {
      const token = jwt.sign({email: user.email, id: user._id})

      res.status(200).json({user: token})
    }
  } else {
    res.status(400).json({
      message: 'Invalid Credentials'
    })
  }
})

router.get(
  '/:id',
  isLogin,
  (req, res, next) => {
    if (req.decoded.id === req.params.id) {
      next()
    } else {
      res.status(401).json({
        message: 'You are not Allowed to open this data'
      })
    }
  },
  async (req, res) => {
    const user = await User.findById(req.params.id).populate('categories')
    // .populate('groups')

    res.status(200).json(user)
  }
)

module.exports = router
