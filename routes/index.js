var express = require('express')
var router = express.Router()
const User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'})
})

router.post('/', async (req, res) => {
  User.create({
    email: req.body.email,
    password: req.body.password
  }).then(user => {
    res.status(201).json(user)
  })
})

module.exports = router
