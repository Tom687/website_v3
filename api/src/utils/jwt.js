import jwt from 'jsonwebtoken'
import config from 'config'

const publicKey = config.get('publicKey')
const privateKey = config.get('privateKey')

export function signJwt(object, options) {
  return jwt.sign(object, privateKey, {
    ...( options && options ),
    algorithm: 'RS256',
  })
}

export function verifyJwt(token) {
  try {
    const decoded = jwt.verify(token, publicKey)

    return {
      valid: true,
      expired: false,
      decoded,
    }
  }
  catch (err) {
    console.warn('verifyJwt error')

    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null,
    }
  }
}