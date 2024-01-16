import AppError from '../utils/AppError.js'
import catchAsync from './catchAsync.js'

const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    const userRole = res.locals.user.role

    if (!roles.includes(userRole)) {
      return next(new AppError('Vous n\'avez pas le role pour faire ça - restrictTo middleware', 403))
    }

    return next()
  })
}

export default restrictTo