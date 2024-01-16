import { lazy } from 'react'
import { buildResponse, builNoDatadResponse } from '../../helpers/docHelpers'
import { TextParagrah } from '../styles/generalStyles'

const DocLayout = lazy(() => import('../doc/docLayout'))

export default function CalendarDoc() {
  const getAllEventsSampleRequest = `
		try {
			const events = await axios.get('/events');
			console.log({ events });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const getOneEventSampleRequest = `
		try {
			const events = await axios.get(\`/events/\${eventId}\`);
			console.log({ events });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  // TODO TODO TODO : Ajouter 'queryParams' ?
  const getUserEventsSampleRequest = `
		try {
			const events = await axios.get('/me/events');
			console.log({ events });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const postEventSampleReq = `
		try {
			const newEventId = await axios.post('/events', {
				title: 'Event title',
				description: 'Optional',
				start: 'TIMESTAMP',
				end: 'TIMESTAMP'
			});
			console.log({ event });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  // TODO TODO TODO : Modifier en /events/:eventId/linkUser et userId dans body
  const linkUserToEventSampleReq = `
		try {
			const res = await axios.post(\`/events/\${eventId}/linkUser\`, {
				userId: '1'
			});
			console.log({ res });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const unlinkUserToEventSampleReq = `
		try {
			const res = await axios.delete(\`/events/\${eventId}/unlinkUser\`, {
				userId: '1'
			});
			console.log({ res });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const updateEventSampleReq = `
		try {
			const res = await axios.put(\`/events/\${eventId}\`, {
				title: 'New event title'
			});
			console.log({ res });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`


  const deleteEventSampleReq = `
		try {
			const res = await axios.delete(\`/events/\${eventId}\`);
			console.log({ res });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`

  const eventObj =
    `event: {
				id: "1",
				title: "Event title",
				description: "Event description",
				startAt: "start timestamp",
				endAt: "end timestamp",
			}`

  const eventArr =
    `events: [{
				id: "1",
				title: "Event title",
				description: "Event description",
				startAt: "start timestamp",
				endAt: "end timestamp",
			}]`


  /*const buildResponse = ({ status, message, data }) => {
    return `
    {
      ${status ? 'status: ' + `"${status}"`  : 'status: "success"'},
      message: "${message}",
      ${data}
    }
    `;
  }

  const builNoDatadResponse = ({ status, message, data }) => {
    return `
    {
      ${status ? 'status: ' + `"${status}"`  : 'status: "success"'},
      message: "${message}",
    }
    `;
  }*/


  const endpoints = [
    {
      method: 'GET',
      title: 'Retourner la liste de tous les évènements',
      hash: '#getAllEvents',
      code: 200,
      successResponse: buildResponse({
        status: 'error',
        message: 'Evènements récupérés avec succès',
        data: eventArr,
      }),
      sampleRequest: getAllEventsSampleRequest,
    },
    {
      method: 'GET',
      title: 'Retourner un évènement spécifique',
      hash: '#getOneEvent',
      uri: '/:id',
      code: 200,
      successResponse: buildResponse({
        message: 'Evènement récupéré avec succès',
        data: eventObj,
      }),
      sampleRequest: getOneEventSampleRequest,
      urlParams: {
        params: 'id=[integer]',
        required: true,
      },
    },
    {
      method: 'GET',
      title: 'Retourner la liste des évènements de l\'utilisateur connecté',
      description: 'En conjonction d\'un système d\'<strong>authentification</strong> et' +
        ' d\'<strong>autorisation</strong> (comme <Link to=\'/profile\'><strong>celui-ci</strong></Link>), permet de retourner les évènements de l\'utilisateur connecté au système.',
      hash: '#getUserEvents',
      urlPrefix: '/me',
      code: '200',
      successResponse: buildResponse({
        message: 'Evènements récupérés avec succès',
        data: eventArr,
      }),
      sampleRequest: getUserEventsSampleRequest,
    },
    {
      method: 'POST',
      title: 'Insérer un évènement',
      hash: '#createEvent',
      code: 201,
      dataParams: `
			{
				title: 'New event title',
				description: 'Optional',
				start_at: 'start timestamp',
				end_at: 'end timestamp'
			}`,
      successResponse: buildResponse({
        message: 'Evènement créé avec succès',
        data: eventObj,
      }),
      sampleRequest: postEventSampleReq,
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: `[
				'Il manque des informations pour créer l\'évènement',
				'Insertion de l\'évènement échouée. Merci de réessayer'
			]`,
      }),
      errorCode: 400,
    },
    {
      method: 'POST',
      title: 'Lier un utilisateur à un évènement',
      hash: '#linkUserToEvent',
      uri: '/:eventId/linkUser',
      description: 'Cette fonctionnalité permet de créer des calendriers complexes, en liant plusieurs utilisateurs au même évènement. Permet, par exemple, de créer des calendriers de plannings d\'entreprise ou encore des calendriers partagés.',
      //description: "Lier un utilisateur à un évènement permet d'avoir, par exemple, un calendrier de travail ou partagé. Prenons exemple sur une entreprise recevant des RDVs quelconques : elle pourra lier le ou les clients concernés à l'évènement, ainsi que la personne (l'employé) qui les prendra en charge. Cela permet de créer des calendriers personnalisés mais aussi et surtout efficaces et organisés.",
      urlParams: {
        params: 'eventId=[integer]',
        required: true,
      },
      dataParams: `
				{ userId: "1" }
			`,
      code: 201,
      successResponse: buildResponse({
        message: 'Utilisateur lié à l\'évènement avec succès',
        data: `userId: "1",
			eventId: "1"`,
      }),
      sampleRequest: linkUserToEventSampleReq,
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: `[
				'Il manque des informations pour lier l\'utilisateur à l\'évènement. Merci de réessayer',
				'Liaison échoué. Veuillez rafraichir la page et réessayer'
			]`,
      }),
      errorCode: 400,
    },
    {
      method: 'PUT',
      title: 'Modifier un évènement',
      hash: '#updateEvent',
      uri: '/:id',
      urlParams: {
        params: 'id=[integer]',
        required: true,
      },
      dataParams: `{ title: "New event title" }`,
      code: 200,
      successResponse: builNoDatadResponse({
        message: 'Evènement modifié avec succès',
        data: eventObj,
      }),
      sampleRequest: updateEventSampleReq,
      //errorCode: 401,
    },
    {
      method: 'DELETE',
      title: 'Supprimer un évènement',
      hash: '#deleteEvent',
      uri: '/:id',
      urlParams: {
        params: 'id=[integer]',
        required: true,
      },
      code: 200,
      successResponse: buildResponse({
        message: 'Evènement supprimé avec succès',
        data: `eventId: "1"`,
      }),
      sampleRequest: deleteEventSampleReq,
    },
    {
      method: 'DELETE',
      title: 'Supprimer le lien entre un utilisateur et un évènement',
      description: 'Action inverse de <code>POST /events/:id/linkUser</code>.',
      hash: '#unlinkUserFromEvent',
      uri: '/:id/unlinkUser',
      urlParams: {
        params: 'id=[integer]',
        required: true,
      },
      dataParams: `{ userId: "1" }`,
      code: 200,
      successResponse: builNoDatadResponse({
        message: 'Utilisateur délié à l\'évènement avec succès',
      }),
      sampleRequest: unlinkUserToEventSampleReq,
      errorCode: '401 UNAUTHORIZED',
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: `[
				'Il manque des informations pour délier l'utilisateur à l'évènement. Merci de réessayer',
				'Déliaison échoué. Veuillez rafraichir la page et réessayer'
			]`,
      }),
    },
  ]


  return (
    <DocLayout
      title="Documentation :"
      githubLink="https://github.com/Tom687/react_fc_min/tree/clean"
      endpoints={endpoints}
      rootUrl="/calendar"
    >
      <TextParagrah>
        Calendrier utilisant <strong>React</strong> avec la bibliothèque <strong>Fullcalendar</strong>, permettant de
        créer l'interface du calendrier. L'interfance de démonstration donnée ici est simplement un "calendrier
        personnel". Cependant, grâce à toutes les fonctionnalités de l'API, on peut créer des calendriers beaucoup plus
        complexes.

        {/*Dans cet exemple, chaque utilisateur a son propre calendrier, mais on peut aussi en faire un calendrier partagé, par exemple pour afficher et gérer les plannings d'une entreprise. On peut faire toutes les actions <strong>CRUD</strong> classiques sur les évènements <code>events</code>. On peut aussi afficher les RDVs de tout le monde ou utiliser des filtres, par exemple "ne voir que les évènements de mes employés" ou "ceux de tel client", grâce à l'<strong>API CRUD</strong> de niveau 2 au backend.*/}
      </TextParagrah>
      <TextParagrah>
        L'<strong>API REST</strong> permet d'effectuer toutes les actions <strong>CRUD</strong> sur les
        évènements <code>events</code>, mais aussi de lier des <code>users</code> à des <code>events</code>, afin de
        pouvoir créer des calendriers plus complexes.
      </TextParagrah>
      <TextParagrah>
        La base de données est <strong>PostgreSQL</strong> et contient trois tables
        : <code>users</code>, <code>events</code> et <code>users_events</code>. Il existe une
        relation <strong>many-to-many</strong> entre les tables <code>users</code> et <code>events</code>, qui passe par
        la <strong>table de jointure</strong>
        <code>users_events</code>.{/*Cela permet de créer des calendriers complexes où un évènement, admettons un RDV chez une ésteticienne, peut être lié à l'employé <code>users</code> qui va s'occuper d'un ou plusieurs clients <code>users</code>. Ainsi, les clients savent quel employé va s'occuper d'eux et vice-versa. Tout ça est basé sur le role de chaque utilisateur <code>users</code> et peut être pris en compte par le système facilement. */}
      </TextParagrah>
      <TextParagrah>
        Grâce à cela, on peut créer des calendriers complexes. Prenons exemple sur un salon de beauté, dont les employés
        sont des utilisateurs <code>users</code> avec le <strong>role</strong> <code>staff</code>, les managers ont
        le <strong>role</strong> <code>manager</code> et les clients ont le <strong>role</strong> <code>client</code>.
        On peut imaginer un calendrier ou chaque <code>users</code> ayant le role <code>manager</code> peut voir et
        créer les plannings de chaque <code>users</code> ayant le role <code>staff</code>, en se basant sur les
        réservations effectuées par les clients ayant le role <code>client</code>, tout en ayant la possibilité de
        filtrer le planning de quel employé <code>staff</code> ils veulent pouvoir voir et / ou modifier.
      </TextParagrah>
      <TextParagrah>
        En reprenant l'exemple ci-dessus, chaque <code>client</code> aura sur son interface un calendrier simple, sur
        lequel il ne verra que les creneaux disponibles et pourra prendre RDV sur ces derniers. Lorsqu'un nouveau RDV
        est créé par un <code>client</code>, un email est envoyé aux <code>managers</code>, qui vont ensuite s'occuper
        de lier l'employé <code>staff</code> qui s'occupera du RDV du client. Une fois le lien effectué,
        le <code>client</code> verra sur son RDV le nom de l'employé <code>staff</code> qui s'occupera de lui, et
        vise-versa.
      </TextParagrah>
    </DocLayout>
  )
}