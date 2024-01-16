import AppError from '../utils/AppError.js'
import catchAsync from '../middlewares/catchAsync.js'
import db from '../../config/postgres.js'
import config from 'config'
import bcrypt from 'bcrypt'

export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, confirmEmail, password, confirmPassword } = req.body

  if (!name || !email || !confirmEmail || !password || !confirmPassword) {
    return next(new AppError('Formulaire incomplet', 400))
  }
  if (email !== confirmEmail) {
    return next(new AppError('Les adresses email ne correspondent pas', 400))
  }
  if (password !== confirmPassword) {
    return next(new AppError('Les mots de passes ne correspondent pas', 400))
  }

  let [userId] = await db('users').select('id').where({ email: req.body.email })

  if (userId) {
    return next(new AppError('Cette adresse email est déjà utilisée', 400))
  }

  const hash = await bcrypt.hash(password, config.get('saltWorkFactor'))

  let role = null

  const user = await db.transaction(async function (trx) {
    const [user] = await db('users').insert({
      name, email,
    }).returning(['id', 'name', 'email']).transacting(trx)

    const [loginResults] = await db('login').insert({
      id_user: user.id, email, hash,
    }).returning(['role']).transacting(trx)

    role = /*Object.keys(*/loginResults.role/*).toString()*/

    await trx.commit(user)
  })

  user.role = role

  if (!user || !user.id) {
    return res.status(400).json({
      status: 'error',
      message: 'Vos identifiants sont corrects mais nous ne pouvons cependant pas vous connecter. Merci de contacter l\'administrateur du site afin de résoudre ce problème',
    })
  }

  res.status(200).json({
    status: 'success',
    message: 'Enregistrement réalisé avec succès. Vous pouvez maintenant vous identifier',
    user,
  })
})

// TODO : Envoyer un JSON
export async function getCurrentUser(req, res) {
  return res.send(res.locals.user) // On utilise res.locals car l'user est enregistré dedans dans deserializeUser
}

export const updateUser = catchAsync(async (req, res, next) => {
  const [updated] = await db('users').update(req.body).where({ id: req.params.id }).returning(Object.keys(req.body)[0])

  res.status(200).json({
    status: 'success',
    message: 'Item modifié avec succès',
    updated,
  })
})

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await db('users').select('*')

  res.status(200).json({
    status: 'success',
    message: 'Liste des utilisateurs récupérée avec succès',
    users,
  })
})

export const getOneUser = catchAsync(async (req, res, next) => {
  if (req.params.id === undefined) {
    return next(new AppError('Aucun identifiant utilisateur donné', 400))
  }

  const [user] = await db('users').select('*').where({ id: req.params.id })

  res.status(200).json({
    status: 'success',
    message: 'Utilisateur récupéré avec succès',
    user,
  })
})

export const deleteUser = catchAsync(async (req, res, next) => {
  if (req.params.id === undefined) {
    return next(new AppError('Aucun identifiant utilisateur donné', 400))
  }

  await db('users').del().where({ id: req.params.id })

  res.status(200).json({
    status: 'success',
    message: 'Utilisateur supprimé avec succès',
    id: req.params.id,
  })
})