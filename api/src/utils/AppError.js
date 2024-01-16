class AppError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true // On testera cette prop pour envoyer au client seulement les erreurs créées ici (=true)

    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError