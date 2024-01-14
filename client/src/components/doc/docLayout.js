import React, { lazy, useEffect } from 'react';
import styled from 'styled-components';
import { Container } from '../styles/generalStyles';


const EndpointsLayout = lazy(() => import('./endpointsLayout'));
const DocItemLayout = lazy(() => import('./docItemLayout'));

export default function DocLayout({
	title,
	githubLink,
	endpoints,
	rootUrl,
	children,
}) {

	return (
		<div id="top">
			<Container>
				<h1>{ title }</h1>
				
				<GithubLink>
					<h2>Git repo :</h2>
					<a href={ githubLink } target="_blank">Lien du repo GitHub</a>
				</GithubLink>
				
				<div>
					{ children }
				</div>
				
				<div>
					<h2>Endpoints :</h2>
					<EndpointsLayout
						endpoints={endpoints}
						rootUrl={rootUrl}
					/>
				</div>
			</Container>

			{
				endpoints.map((endpoint, i) => (
					<DocItemLayout
						key={i}
						id={endpoint.hash.slice(1)}
						title={endpoint.title}
						description={endpoint.description}
						code={endpoint.code}
						successResponse={endpoint.successResponse}
						success={endpoint.success}
						sampleRequest={endpoint.sampleRequest}
						endpoint={{
							url: `${endpoint.urlPrefix ? endpoint.urlPrefix : ''}${rootUrl}${endpoint.uri ? endpoint.uri : ''}`,
							//url: (endpoint.urlPrefix ? endpoint.urlPrefix : '') + rootUrl + (endpoint.uri ? endpoint.uri : ''),
							method: endpoint.method
						}}
						urlParams={endpoint?.urlParams}
						dataParams={endpoint?.dataParams}
						errorCode={endpoint?.errorCode}
						errorResponse={endpoint?.errorResponse}
					/>
				))
			}
			
		</div>
	)
}

const GithubLink = styled.div`
	margin: 1rem 0;
	margin-bottom: 2rem;
`;