import AppError from '../utils/AppError.js'
import catchAsync from '../middlewares/catchAsync.js'
import db from '../../config/postgres.js'

export const getAllEvents = catchAsync(async (req, res, next) => {
  const events = await db('events').select('*')

  res.status(200).json({
    status: 'success',
    message: 'Evènements récupérés avec succès',
    events,
  })
})

export const getEvent = catchAsync(async (req, res, next) => {
  if (req.params.id === undefined) {
    return next(new AppError('Il manque un paramètre pour récupérer l\'évènement', 400))
  }

  const [event] = await db('events').select('*').where({ id: req.params.id })

  res.status(200).json({
    status: 'success',
    message: 'Evènement récupéré avec succès',
    event,
  })
})

export const getEvents = catchAsync(async (req, res, next) => {
  const userId = res.locals.user.id

  const userRole = res.locals.user.role

  // TODO : Optimiser queries avec nouvelles queries sans JOIN (check queries.sql) ?
  const eventsQuery = db.select(
    'e.id',
    'e.title',
    'e.start_at AS start',
    'e.end_at AS end',
    'e.description',
  )
  .from('events AS e')
  .innerJoin('users_events AS ue', 'ue.id_event', 'e.id')
  .innerJoin('users AS u', 'ue.id_user', 'u.id')
  .innerJoin('login AS l', 'l.id_user', 'u.id')
  .whereIn('e.id', function () {
    this.select('id_event').from('users_events')
    .where({ id_user: userId })
  })
  .groupBy('e.id')
  .orderBy('e.id', 'ASC')

  if (userRole !== 'user' && userRole !== 'guest') {
    eventsQuery.orWhereNotIn('e.id', function () {
      this.select('id_event').from('users_events')
      .where({ id_user: userId })
    })
  }

  const events = await eventsQuery

  res.status(200).json({
    status: 'success',
    message: 'Evènements récupérés avec succès',
    events,
  })
})


// TODO : Transaction pour insérer event puis users liés ?
// TODO : Quand insert userId, vérifier le role par la DB ou cookie / req.locals.user ?
export const insertEvent = catchAsync(async (req, res, next) => {
  const { title, description, start: start_at, end: end_at } = req.body

  if (!title || !start_at || !end_at) {
    return next(new AppError('Il manque des informations pour créer l\'évènement', 400))
  }

  const [event] = await db('events').insert({
    title,
    description,
    start_at,
    end_at,
  }).returning(['id', 'title', 'start_at AS start', 'end_at AS end', 'description'])

  if (!event.id) {
    return next(new AppError('Insertion de l\'évènement échouée. Merci de réessayer', 400))
  }

  res.status(201).json({
    status: 'success',
    message: 'Evènement créé avec succès',
    event,
  })
})


// TODO TODO TODO : Retourner updatedEvent ?
export const updateEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const userId = res.locals.user.id
  const role = res.locals.user.role

  // If user role = user, can only modify tis event. If admin, can modify all events
  if (( role !== 'admin' || role !== 'super-admin'
      || role !== 'staff' )
    && role === 'user'
  ) {
    // This query updates the event only if the user is linked to the event (in users_events table)
    await db('events AS e').update(req.body).whereIn('e.id', function () {
      this.select('id_event').from('users_events')
      .where({ id_user: userId })
      .andWhere({ id_event: id })
    }).returning(['id', 'title', 'description', 'start_at AS start', 'end_at AS end'])

    return res.status(200).json({
      status: 'success',
      message: 'Evènement modifié avec succès',
    })
  }

  await db('events').update(req.body).where({ id })

  res.status(200).json({
    status: 'success',
    message: 'Evènement modifié avec succès',
  })
})

export const linkUserToEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { userId } = req.body

  if (!userId || !id) {
    return next(new AppError('Il manque des informations pour lier l\'utilisateur à l\'évènement. Merci de réessayer', 401))
  }

  const linkUser = await db('users_events').insert({
    id_user: userId, id_event: id,
  })

  if (linkUser.rowCount !== 1 || linkUser.rowCount < 1) {
    return next(new AppError('Liaison échoué. Veuillez rafraichir la page et réessayer', 401))
  }

  res.status(201).json({
    status: 'success',
    message: 'Utilisateur lié à l\'évènement avec succès',
  })
})


export const unlinkUserFromEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { userId } = req.body

  if (!userId || !id) {
    return next(new AppError('Il manque des informations pour délier l\'utilisateur à l\'évènement. Merci de réessayer', 401))
  }

  const unlinkUser = await db('users_events').del().where({
    id_user: userId,
    id_event: id,
  })

  if (unlinkUser.rowCount !== 1 || unlinkUser.rowCount < 1) {
    return next(new AppError('Déliaison échoué. Veuillez rafraichir la page et réessayer', 401))
  }

  res.status(201).json({
    status: 'success',
    message: 'Utilisateur délié à l\'évènement avec succès',
    userId,
    eventId: id,
  })
})

// TODO TODO TODO : Vérifier si event existe avant de supprimer ? Voir si ça plante tout ou pas, si gestion erreur correcte
export const deleteEvent = catchAsync(async (req, res, next) => {
  if (req.params.id === undefined) {
    return next(new AppError('Aucun évènement sélectionné', 400))
  }

  await db('events').del().where({ id: req.params.id })

  res.status(200).json({
    status: 'success',
    message: 'Evènement supprimé avec succès',
    id: req.params.id,
  })
})