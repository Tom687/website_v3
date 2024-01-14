import styled from 'styled-components';
import { Container } from './generalStyles';

export const DescriptionParagraph = styled.p`
	//padding: 0.75rem;
`;

export const CardWrapper = styled(Container)`
  //padding: 2.5em;
	
	ul {
		margin-top: 0.5em;
	}
	
	li {
		padding: 0.2rem 0;
	}
	
	h1, h2, h3, h4, h5, h6 {
		//margin: 1.5rem;
	}
	
	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}
	
	h3 {
		font-size: 1.35rem;
		margin-bottom: 1.25em;
	}
	h4:first-child {
		margin-top: 0.5em;
	}
	h5:first-child {
		margin-bottom: 0.5em;
	}
	h3:first-child {
		margin-bottom: 1em;
	}
	
	p {
		margin-bottom: 1em;
	}
`;

export const CardItem = styled.div`
	h4 {
		font-size: 1.1em;
	}
	h5 {
		font-size: 0.95em;
		margin: 0;
	}
	padding: 0.25em 0;
	
	ul:first-child {
		margin-top: 0;
	}
	
	pre[data-title="data"] {
		margin-bottom: 1.5em;
    margin-top: 1em;
	}
`;