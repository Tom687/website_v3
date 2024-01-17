import { lazy } from 'react'
import { buildResponse, builNoDatadResponse } from '../../helpers/docHelpers'
import { TextParagrah } from '../styles/generalStyles'

const DocLayout = lazy(() => import('../doc/docLayout'))

export default function AuthDoc() {
  const getMySessionsSampleRequest = `
		try {
			const sessions = await axios.get('/me/sessions');
			console.log({sessions});
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const getSessionsSampleRequest = `
		try {
			const sessions = await axios.get('/sessions');
			console.log({sessions});
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const postSessionsSampleReq = `
		try {
			const newSession = await axios.post('/sessions', {
				email,
				password,
			});
			console.log({newSession});
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const deleteSessionsSampleReq = `
		try {
			const deleteSession = await axios.delete('/sessions');
			console.log({deleteSession});
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const getGoogleOAuthSampleReq = `
		function getGoogleOAuthUrl() {
			const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
			
			const options = {
				redirect_uri: '/api/v1/sessions/oauth/google',
				client_id: 'YOUR_CLIENT_ID',
				access_type: 'offline',
				response_type: 'code',
				prompt: 'consent',
				scope: [
					'https://www.googleapis.com/auth/userinfo.profile',
					'https://www.googleapis.com/auth/userinfo.email',
				].join(' '),
			};
			
			const qs = new URLSearchParams(options);
			
			return rootUrl + '?' + qs.toString() };
		}
		
		<a href={getGoogleOAuthUrl()}>Se connecter avec Google</a>
	`

  const forgotPasswordSampleReq = `
		try {
			const res = await axios.post('/auth/forgotPassword');
			console.log({res});
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const resetPasswordSampleReq = `
		try {
			const res = await axios.patch(\`/auth/resetPassword/\${token}\`, {
				password: 'XXX',
				confirmPassword: 'XXX'
			});
			console.log({ res });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const userObj =
    `user: {
				id: "1",
				name: "Jhon Doe",
				email: "user@email.com",
				picture: "/path/to/picture",
				joined: "timestamp",
			}`

  const usersArr =
    `users: [{
				id: "1",
				name: "Jhon Doe",
				email: "user@email.com",
				picture: "/path/to/picture",
				joined: "timestamp",
			}]`

  const sessionObj =
    `session: {
				id: "1",
				userId: "1",
				userAgent: "Jhon Doe",
				valid: "user@email.com",
				iat: "timestamp",
				expires: "timestamp",
			}`

  const sessionsArr =
    `sessions: [{
				id: "1",
				userId: "1",
				userAgent: "Safari/Chrome/Mozilla",
				valid: "true",
				iat: "timestamp",
				expires: "timestamp",
			}]`


  const endpoints = [
    {
      method: 'GET',
      title: 'Retourner les sessions actives de l\'utilisateur connecté',
      description: 'Il y a plusieurs utilisations possibles à ce endpoint. On peut l\'utiliser pour la <strong>persistance de la session utilisateur</strong>, en appelant le endpoint à chaque fois que l\'utilisateur rafraichi la pâge de votre UI par exemple. On peut aussi l\'utiliser pour lister à l\'utilisateur ses sessions actives.',
      hash: '#getMySessions',
      urlPrefix: '/me',
      code: 200,
      successResponse: buildResponse({
        message: 'Utilisateur reconecté',
        data:
          `${sessionsArr},
			${userObj}`,
      }),
      errorCode: 400,
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: `[
				"Aucune session trouvée",
				"Utilisateur inéxistant"
			]`,
      }),
      sampleRequest: getMySessionsSampleRequest,
    },
    {
      method: 'GET',
      title: 'Retourner la liste des sessions',
      hash: '#getSessions',
      code: 200,
      successResponse: buildResponse({
        message: 'Sessions récupérées avec succès',
        data:
          `${sessionsArr},
			${userObj}`,
      }),
      /*errorCode: 400,
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: `[
        "Aucune session trouvée",
        "Utilisateur inéxistant"
      ]`
      }),*/
      sampleRequest: getSessionsSampleRequest,
    },
    {
      method: 'POST',
      title: 'Créer une session utilisateur',
      hash: '#createSession',
      description: 'Permet de se connecter au système et retourne les <strong>JWT</strong> <code>accessToken</code> et <code>refreshToken</code> ainsi que les informations de l\'utilisateur. L\'API va tenter de passer les JWT au client via des <strong>cookies <code>httpOnly</code></strong> mais ils sont aussi retournés dans la réponse, si le client souhaite utiliser le <code>Header Authorization</code>.',
      dataParams: `
			{
				email: 'jhondoe@email.com',
				password: 'password'
			}`,
      code: 200,
      successResponse: buildResponse({
        message: 'Vous êtes maintenant connecté',
        data:
          `accessToken: "accessTokenJWTString"
			refreshToken: "refreshTokenJWTString,
			${userObj}`,
      }),
      sampleRequest: postSessionsSampleReq,
      errorCode: '401 UNAUTHORIZED',
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: `[
				"Adresse email non reconnue",
				"Mauvais MDP",
				"Utilisateur inexsitant"
			]`,
      }),
    },
    {
      method: 'DELETE',
      title: 'Supprimer une session',
      description: 'Si un utilisateur connecté au système appèle ce endpoint, il se fait déconnecter.',
      hash: '#deleteSession',
      uri: '/:id',
      urlParams: {
        params: 'id=[integer]',
        required: true,
      },
      code: 200,
      successResponse: buildResponse({
        message: 'Déconnecté avec succès',
        data:
          `accessToken: null,
			refreshToken: null`,
      }),
      errorCode: 400,
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: 'Un problème est survenu. Veuillez rafraichir la page',
      }),
      sampleRequest: deleteSessionsSampleReq,
    },
    {
      method: 'GET',
      title: 'Se connecter via Google',
      description: 'Permet à l\'utilisateur de se connecter et créer une session avec son compte Google. Fait la même chose que <code>GET /me/sessions</code> (JWTs, cookies).',
      hash: '#getGoogleSession',
      uri: '/oauth/google',
      code: 200,
      successResponse: 'Redirection vers le site',
      errorCode: '403 FORBIDEN',
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: 'Votre compte Google doit être vérifié',
      }),
      sampleRequest: getGoogleOAuthSampleReq,
    },
    {
      method: 'POST',
      title: 'Mot de passe oublié',
      description: 'C\'est la première étape lorsqu\'on veut modifier son mot de passe, qui consiste à donner son adresse email. L\'existance de l\'utilisateur en DB est vérifiée puis est envoyé un lien contenant en paramètre un token crypté spécifique à l\'utilisateur et dont la durée de vie est limitée. Une fois le lien cliqué, l\'utilisateur est redirigé sur PATCH /auth/resetPassword.',
      hash: '#forgotPassword',
      uri: '/auth/forgotPassword',
      dataParams: `{ email: 'jhondoe@email.com' }`,
      code: 200,
      successResponse: builNoDatadResponse({
        message: 'Un email contenant un lien pour modifier votre MDP vous a été envoyé',
      }),
      errorCode: '404 NOT FOUND || 500',
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: `[
					"Utilisateur inexistant",
					"Email non envoyé. Veuillez réessayer",
				]`,
      }),
      sampleRequest: forgotPasswordSampleReq,
    },
    {
      method: 'PUT', // TODO TODO TODO : PUT ou PATCH ?
      title: 'Modifier son mot de passe',
      description: 'Après avoir cliqué sur le lien envoyé par la requête précédante (<code>POST /auth/forgotPassword</code>), le resetToken en paramètre de l\'URL est enregistré en DB et est lié à l\'utilisateur. Vérifie l\'existance de l\'utilisateur, puis si le resetToken n\'est pas expiré et enfin si les nouveaux mots de passe sont les mêmes. Le nouveau mot de passe est encrypté avant de l\'insérer en DB. Supprime ensuite le resetToken et son expiration liés à l\'utilisateur puis invalide toutes ses sessions actives, afin de le forcer à se reconnecter sur chaque appareil.',
      hash: '#resetPassword',
      uri: '/auth/resetPassword/:token',
      urlParams: {
        params: 'token=[string]',
        required: true,
      },
      dataParams: `
					{
						password: '_NewPassword',
						confirmPassword: '_NewPassword'
					}`,
      code: 200,
      successResponse: buildResponse({
        message: 'Le mot de passe a été modifié avec succès. Vous allez être redirigé',
        data:
          `accessToken: null,
			refreshToken: null`,
      }),
      errorCode: '400 || 404 NOT FOUND',
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: `[
				"Le reset token a expiré",
				"Les mots de passe ne correspondent pas",
				"Erreur lors de la réinisialisation du mot de passe. Merci de réessayer",
				"Utilisateur ou reset token inexistan"'
			]`,
      }),
      sampleRequest: resetPasswordSampleReq,
    },
  ]

  return (
    <DocLayout
      title="Documentation :"
      githubLink="https://github.com/Tom687/node-jwt-Oauth/tree/deploy"
      endpoints={endpoints}
      rootUrl="/sessions"
    >
      <TextParagrah>
        C'est une API REST de niveau 2 et un système d'authentification complet, qui permet toutes les actions relatives
        à l'<strong>inscription d'utilisateurs</strong> <code>users</code>, leur <strong>connexion au système</strong>,
        la <strong>persistance de leur session</strong>, la <strong>modification de leur mot de passe</strong>, ainsi
        que les opérations <strong>CRUD</strong> sur les utilisateurs <code>users</code> et
        les <code>sessions</code>. {/*Ce système analyse chaque requête envoyée à l'API pour y chercher des <strong>JWT</strong> dans les <strong>cookies</strong> ou dans le header <code>Authorization</code>, permettant de savoir si la requête provient d'un utilisateur connecté au système ou non et de ne retourner seulement ce que le client a le droit de voir, par rapport à son <strong>rôle</strong>.*/}
      </TextParagrah>
      <TextParagrah>
        Ce système d'authentification et d'autorisation est celui même utilisé sur ce site. Il propose un système
        de <strong>sessions</strong> à base de <strong>JWT</strong>. Lorsqu'une requête passe par cette API,
        un <strong>middleware</strong> va analyser les cookies (qui sont <strong>httpOnly</strong>) ainsi que le
        header <code>Authorization</code> pour y chercher ces JWT. Si ils existent, les <strong>JWT</strong>
        <code>accessToken</code> et <code>refreshToken</code> sont extraits de la requête et décodés, permettant de
        savoir si le client demandant la requête est autorisé à la faire ou non. Si aucun JWT n'est trouvé ou qu'ils ne
        correspondent pas au client effectuant la requête, ce dernier n'est pas autorisé à voir le contenu.
      </TextParagrah>
      <TextParagrah>
        Ces JWT sont retournés au client lorsqu'une tentative de connexion sur <code>POST /me/sessions</code> est
        réussie (ou encore <code>GET /sessions/oauth/google</code>). Ils y sont insérés par le biais
        de <strong>cookies</strong> ou alors dans la mémoire du navigateur (<code>localStorage</code>). Le middleware va
        aussi permettre la <strong>persistance de la session utilisateur</strong> grâce à
        l'<code>accessToken</code> couplé au <code>refreshToken</code>. Tant que le <code>refreshToken</code> du client
        est valide, si l'<code>accessToken</code> ne l'est plus, il sera remplacé par un nouveau.
      </TextParagrah>
      <TextParagrah>
        De plus, l'API propose un middleware <code>requireUser</code>, qui permet de protéger les routes voulues des
        utilisateurs non connectés au système. Un autre middleware <code>restrictTo</code> permet de définir les rôles
        des utilisateurs <code>users</code> qui auront accès aux ressources du endpoint.
      </TextParagrah>
      <TextParagrah>
        On peut aussi <strong>se connecter via Google</strong>, en utilisant leur service <strong>Oauth</strong>.
        Lorsque ce cas ce produit et si aucun utilisateur <code>users</code> n'a la même adresse email, un
        utilisateur <code>users</code> sera alors créé. Dans le cas contraire, les informations de
        l'utilisateur <code>users</code> ne seront que mises à jour, si celles provenant de Google diffèrent de celles
        déjà présentes dans la base de données.
        Si on se connecte par Google, une nouvelle session de l'utilisateur est créé et
        les <strong>accessToken</strong> et <strong>refreshToken</strong> utilisés sont remplacés par ceux de Google.
      </TextParagrah>
      <TextParagrah>
        La base de donnée utilisée est <strong>PostgreSQL</strong> et comporte trois tables
        : <code>sessions</code>, <code>users</code> et <code>login</code>. La table <code>login</code> est utilisée pour
        enregistrer les identifiants "locaux", c'est à dire ceux des utilisateurs qui s'inscrivent via leur adresse
        email. La table <code>sessions</code> permet d'enregistrer toutes les <strong>sessions</strong> des
        utilisateurs <code>users</code>, ce qui permet la <strong>persistance de la session utilisateur</strong>, en
        conjonction des autres fonctionnalités de cette API.
      </TextParagrah>
      <TextParagrah>
        Comme indiqué sur le schéma ci-dessous, il existe une relation <strong>one-to-many</strong> entre la
        table <code>users</code> et la table <code>sessions</code>. Ainsi, un utilisateur peut avoir plusieurs sessions,
        mais une session ne peut être liée qu'à un seul utilisateur. De plus, une
        relation <strong>one-to-one</strong> exite entre <code>users</code> et <code>login</code>. De ce fait, un
        utilisateur ne peut avoir qu'un seul identifiant, s'il s'inscrit avec son adresse email. Cela ne l'empêche
        cependant pas de s'inscrire avec son adresse email, se connecter par la suite avec Google et ainsi de suite,
        grâce à la relation <strong>one-to-many</strong> entre les tables <code>users</code> et <code>sessions</code> et
        les fonctionnalités internes de l'API.
      </TextParagrah>

    </DocLayout>
  )
}