const jwt = require('../helpers/jwt')
const User = require('../models/user')

module.exports = async (req, res, next) => {
  if (req.headers.token) {
    try {
      const decoded = jwt.valid(req.headers.token)
      const user = await User.findOne({email: decoded.email})
      if (user) {
        req.decoded = user
        next()
      } else {
        throw new Error('invalid')
      }
    } catch (e) {
      console.log(e)
      res.status(401).json({message: 'Unaothorized Access'})
    }
    return
  }

  res.status(401).json({message: 'Unaothorized Access'})
}
