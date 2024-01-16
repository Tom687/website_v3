import AppError from '../utils/AppError.js'

const requireUser = (req, res, next) => {
  const user = res.locals.user

  if (!user) {
    return next(new AppError('Veuillez vous connecter pour voir cette page - requireUser middleware', 403))
  }
  //return res.status(403).send('requireUser failed'); // TODO : Pas d'erreur ?

  return next()
}

export default requireUser