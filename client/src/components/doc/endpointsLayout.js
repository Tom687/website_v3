import styled from 'styled-components';
import { Link } from 'react-router-dom';

export default function EndpointsLayout({
	rootUrl,
	endpoints,
}) {

	return (
		<EndpointsTable>
			<thead>
				<tr>
					<th>Method</th>
					<th>URL</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{
					endpoints.map((endpoint, i) => (
						<tr key={i}>
							<td>{ endpoint.method }</td>
							<td>
								{ endpoint.urlPrefix ? endpoint.urlPrefix : null }
								{ rootUrl }
								{ endpoint.uri ? endpoint.uri : null }
							</td>
							<td>
								<Link to={{ hash: endpoint.hash }}>{ endpoint.title }</Link>
							</td>
						</tr>
					))
				}
			</tbody>
		</EndpointsTable>
	)
}

const EndpointsTable = styled.table`
	border-collapse: collapse;
  margin: 2rem 0;
  display: block;
  overflow-x: auto;
	
	tbody tr {
    border-top: 1px solid #dfe2e5;
	}
	
	tr {
    border: none;
	}

  td, th {
    padding: 1.2em 1em;
    border: none;
    border-right: 1px solid #dfe2e5;
  }
`;