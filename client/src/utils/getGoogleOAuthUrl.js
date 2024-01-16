export default function getGoogleOAuthUrl() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

  const baseURL =
    process.env.NODE_ENV === 'production'
      ? '/api/sessions/oauth/google'
      : 'http://localhost:1337/api/sessions/oauth/google'

  const options = {
    redirect_uri: baseURL,
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'xxx-xxx-xx',
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '), // TODO : Pourquoi on utilise .join() sur scopes ?
  }

  const qs = new URLSearchParams(options)

  return `${rootUrl}?${qs.toString()}`
}