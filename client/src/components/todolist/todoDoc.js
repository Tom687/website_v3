import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { buildResponse, builNoDatadResponse } from '../../helpers/docHelpers';
import { lazy } from 'react';
import { TextParagrah } from '../styles/generalStyles';

const DocLayout = lazy(() => import('../doc/docLayout'));

export default function TodoDoc() {
  const todoObj = ({ title, completed }) =>
    `todo: {
				id: "1",
				userId: "1",
				title: "${title}",
				completed: "${completed ? completed : 'false'}",
				created_on: "timestamp",
				done_one: "timestamp"
			}`;

  const todosArr =
          `todo: [{
				id: "1",
				userId: "1",
				title: "Todo à faire super important",
				completed: false,
				created_on: "timestamp",
				done_one: "timestamp"
			}]`;

  const getAllTodosSampleReq = `
		try {
			const todos = await axios.get('/todos');
			console.log({ todos });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`;

  const getOneTodoSampleReq = `
		try {
			const todo = await axios.get(\`/todos/\${todo.id}\`);
			console.log({ todo });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`;

  const getUserTodosSampleReq = `
		try {
			const todo = await axios.get('/me/todos');
			console.log({ todo });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`;

  const createTodoSampleReq = `
		try {
			const todo = await axios.post('/todos', {
				title: 'New todo title',
			});
			console.log({ todo });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`;

  const updateOneTodoSampleReq = `
		try {
			const todo = await axios.put(\`/todos/\${todo.id}\`, {
				title: 'New title for this todo'
			});
			console.log({ todo });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`;

  const toggleAllTodosSampleReq = `
		try {
			const res = await axios.put('/todos', {
				completed: true
			});
			console.log({ res });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`;

  const deleteTodoSampleReq = `
		try {
			const res = await axios.delete(\`/todos/\${todo.id}\`);
			console.log({ res });
		}
		catch (err) {
			console.log(err.response.data.message || err);
		}
	`;

  const endpoints = [
    {
      method: 'GET',
      title: 'Retourner tous les todos',
      hash: '#getAllTodos',
      code: 200,
      successResponse: buildResponse({
        message: 'Todos récupérés avec succès',
        data: `${todosArr}`,
      }),
      // TODO TODO TODO : Mettre en place ça quelque part (pas forcément sur todos)
      errorCode: '401 UNAUTHORIZED',
      error: builNoDatadResponse({
        status: 'error',
        message: 'Vous devez être administrateur pour voir la liste entière des todos',
      }),
      sampleRequest: getAllTodosSampleReq,
    },
    {
      method: 'GET',
      title: 'Retourner un todo spécifique',
      hash: '#getOneTodo',
      uri: '/:id',
      urlParams: {
        params: 'id=[integer]',
        required: true,
      },
      code: 200,
      successResponse: buildResponse({
        message: 'Todo récupéré avec succès',
        data: `${todoObj}`,
      }),
      sampleRequest: getOneTodoSampleReq,
    },
    {
      method: 'GET',
      title: 'Retourner les todos de l\'utilisateur connecté',
      description: 'En conjonction d\'un système d\'<strong>authentification</strong> et' +
        ' d\'<strong>autorisation</strong> (comme <Link to=\'/profile\'><strong>celui-ci</strong></Link>, permet de retourner les todos de l\'utilisateur connecté.',
      hash: '#getUserTodos',
      urlPrefix: '/me',
      code: 200,
      successResponse: buildResponse({
        message: 'Todos récupérés avec succès',
        data: `${todosArr}`,
      }),
      errorCode: '401 UNAUTHORIZED',
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: 'Veuillez vous connecter pour voir vos todos',
      }),
      sampleRequest: getUserTodosSampleReq,
    },
    {
      method: 'POST',
      title: 'Créer un todo',
      hash: '#createTodo',
      dataParams: `{ title: "My Todo Title" }`,
      code: 201,
      successResponse: buildResponse({
        message: 'Todo créé avec succès',
        data: todoObj({ title: 'My Todo Title' }),
      }),
      errorCode: 400,
      errorResponse: builNoDatadResponse({
        status: 'error',
        message: 'Il manque des infos pour insérer le todo en DB',
      }),
      sampleRequest: createTodoSampleReq,
    },
    {
      method: 'PUT',
      title: 'Modifier le status de tous les todos',
      hash: '#toggleAllTodos',
      description: 'Ce endpoint permet de passer le status de tous les todos d\'un utilisateur, soit passer la valeur <code>completed</code> à <code>true</code> ou <code>false</code> pour tous les todos de l\'utilisateur connecté.',
      dataParams: `{ completed: true || false }`,
      code: 200,
      successResponse: builNoDatadResponse({
        message: 'Tous les todos sont maintenant \'faits\'',
      }),
      sampleRequest: toggleAllTodosSampleReq,
    },
    {
      method: 'PUT',
      title: 'Modifier un todo',
      hash: '#updateOneTodo',
      uri: '/:id',
      urlParams: {
        params: 'id=[integer]',
        required: true,
      },
      dataParams: `
			{
				completed: true,
				title: 'New todo title'
			}`,
      code: 200,
      successResponse: buildResponse({
        message: 'Todo modifié avec succès',
        data: todoObj({ title: 'New todo title' }),//`${todoObj}`
      }),
      sampleRequest: updateOneTodoSampleReq,
    },
    {
      method: 'DELETE',
      title: 'Supprimer un todo',
      hash: '#deleteTodo',
      uri: '/:id',
      urlParams: {
        params: 'id=[integer]',
        required: true,
      },
      code: 200,
      successResponse: buildResponse({
        message: 'Todo supprimé avec succès',
        data: `id: "1"`,
      }),
      sampleRequest: deleteTodoSampleReq,
    },
  ];

  return (
    <DocLayout
      title="Documentation :"
      githubLink="https://github.com/Tom687/react-todolist/tree/clean2"
      endpoints={endpoints}
      rootUrl="/todos"
    >
      {/*<div>
       <h2>Git repo</h2>
       <a href="https://github.com/Tom687/react-todolist/tree/clean2" target="_blank">Lien du repo GitHub</a>
       </div>*/}
      {/*<div>
       <h2>Description</h2>
       <DescriptionParagraph>
       Application Todolist utilisant <strong>React</strong> accompagné de <strong>Redux</strong> pour le frontend, <strong>Node / Express</strong> pour le backend et <strong>PostgreSQL</strong> pour la base de données. Utilise aussi <strong>Docker</strong>, qui permet de pré-configurer un environnement de travail et le répliquer sur n'importe quelle machine. Facilite le développement, test et partage de l'application.
       </DescriptionParagraph>
       <DescriptionParagraph>
       L'objectif de ce projet est de proposer une Todolist n'affichant que les todos de l'utilisateur connecté, avec une gestion du state au frontend par <strong>Redux</strong>. Ce projet propose un CRUD sur les <code>todos</code> (table en DB du même nom) et est un bon exemple de structure d'un petit projet <strong>React + Redux</strong>.
       </DescriptionParagraph>
       <DescriptionParagraph>
       N'étant pas l'objectif de l'application, elle ne propose pas de système de création d'utilisateur. Cependant,
        elle contient tout de même une table <code>users</code>, liée à la table <code>todos</code>. Lorsque lancée en environnement de développement, 4 utilisateurs sont pré-inscrits en DB et un système de login ultra simplifié à base de JWT permet de switcher entre ces 4 utilisateurs. En production cependant, il est préférable de lier l'application à un vrai système d'authentification et d'authorisation comme c'est le cas sur cette démo. Le système d'autentification utilisé n'est autre que <a href="https://github.com/Tom687/node-jwt-Oauth.git" target="_blank">celui-ci</a>.
       </DescriptionParagraph>
       <DescriptionParagraph>
       Chaque action que vous effectuerez sur l'application (ajouter un todo, supprimer, changer de status, etc…) sera, si vous êtes connecté, enregistrée en base de donnée, ce qui vous permettra de garder vos todos en lieu sur, étant donné que vous n'aurez qu'à vous reconnecter pour retrouver la liste de todos telle que vous l'aviez laissée.
       </DescriptionParagraph>
       <DescriptionParagraph>
       Afin de pouvoir offrir une démo ne nécessitant pas de se connecter pour tester l'application, si vous n'êtes pas connecté, chaque action sera enregistrée dans la mémoire de votre navigateur.
       </DescriptionParagraph>
       <DescriptionParagraph>
       Pour lancer l'application en local sur votre machine, il vous suffit de cloner le repo git, ouvrir le projet, puis dans votre terminal, allez dans le dossier <code>server</code> et y lancer la commande <code>docker compose up --build</code>. Ensuite, allez dans le dossier <code>client</code>, lancez <code>npm install</code> pour installer les dépendances puis <code>npm start</code>. Allez maintenant sur <code>http://localhost:3000</code> et l'application est en route.
       </DescriptionParagraph>
       </div>*/}

      <TextParagrah>
        Ce projet utilise une base de données <strong>PostgreSQL</strong>, qui contient deux tables
        : <code>users</code> et <code>todos</code>, liées par une relation <strong>one-to-one</strong>. Par design,
        chaque item <code>todos</code> ne peut donc être lié qu'à un seul utilisateur <code>users</code>, et
        inversement.
      </TextParagrah>
      <TextParagrah>
        Toute l'interface utilisateur est gérée par <strong>React + Redux</strong>, permettant une utilisation de cette
        dernière indépendante de l'API.
      </TextParagrah>
      <TextParagrah>
        L'API est codée avec le framework <strong>Express</strong>, basé sur <strong>Nodejs</strong>. C'est une API REST
        de niveau 2. Couplée à un système d'authentification / autorisation comme <Link to="/profile">celui-ci</Link>,
        qui est le même utilisé sur ce même site, un endpoint <code>GET /me/todos</code> permet de récupérer la liste
        des todos de l'utilisateur connecté au système.
      </TextParagrah>
      {/*<p>
       Le endpoint <code>GET /me/todos</code> est protégé au niveau de l'API, seul les utilisateurs connectés peuvent y accéder et, comme dit plus haut, le endpoint retournera tous les items <code>todos</code> de l'utilisateur <code>users</code> connecté au système.
       </p>*/}
      <TextParagrah>
        Si on n'utilise pas de système d'authentification, on peut tout de même récupérer les <code>todos</code> d'un
        utilisateur en utilisant une requête <code>GET</code> sur <code>/todos?userId=1</code>, qui retournera la même
        chose qu'un utilisateur connecté et qui récupère ses <code>todos</code> par une requête automatique de
        l'interface <code>GET</code> sur <code>/me/todos</code>.
      </TextParagrah>
      <TextParagrah>
        L'intérêt d'implémenter ces 2 méthodes permettent de renforcer l'aspect REST de l'API, même si, "dans la vraie
        vie", il serait étrange de protéger des ressources (ici les items <code>todos</code> d'un
        utistateur <code>users</code>) sur <code>GET /me/todos</code> alors qu'on peut les retirer publiquement et sans
        protection depuis <code>GET /todos?userId=1</code>.
      </TextParagrah>
    </DocLayout>
  );
}