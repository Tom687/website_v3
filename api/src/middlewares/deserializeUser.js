import lodash from 'lodash'
import { verifyJwt } from '../utils/jwt.js'
import { reIssueAccessToken } from '../utils/sessions.js'
import config from 'config'

const { get } = lodash

const deserializeUser = async (req, res, next) => {
  // By checking in the cookies and in the headers for the tokens, we can use it however we want clientside
  const accessToken = get(req, 'cookies.accessToken') ||
    get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')

  const refreshToken = get(req, 'cookies.refreshToken') ||
    get(req, 'headers.x-refresh')

  if (!accessToken) {
    return next()
  }

  const { decoded, expired } = verifyJwt(accessToken)

  // TODO : Voir si ajouter user dans res.session ou autre ? (voir ancien tuto connexion)
  if (decoded) {
    res.locals.user = decoded
    return next()
  }

  // TODO : Voir différences avec ancien tuto (connexion)
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken })
    if (newAccessToken) {
      // Using headers + cookie for the token offers the possibility for the client to use localStorage (with the header) to store the token if he wants to, otherwise the client will use the token from the cookie
      res.setHeader('x-access-token', newAccessToken)

      // TODO TODO TODO : Diff maxAge et expiresIn ? (maxAge = cookie, expiresIn = JWT) Comment utiliser maxAge en config.get() ?
      // Set the token in a cookie (+ the header above)
      res.cookie('accessToken', newAccessToken, {
        //maxAge: config.get('accessTokenTtl'), // 15min
        maxAge: 9000000 * 2, // 300min
        httpOnly: true, // Permet de n'accéder au cookie que par HTTP (et pas par JS, bonne sécurité)
        domain: config.get('domain'), // TODO : Ajouter au fichier config car on aura besoin de changer en production
        path: '/',
        sameSite: 'lax',
        secure: config.get('cookieTokenSecure'), // TODO : En prod, mettre secure: true (oblige de passer par du https)
      })

      const result = verifyJwt(newAccessToken)

      res.locals.user = result.decoded

      return next()
    }

    return next()
  }
}

export default deserializeUser;