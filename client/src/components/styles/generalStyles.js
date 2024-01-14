import styled from 'styled-components';

export const colors2 = {
  blue: {
    hex: '#0070F3',
    rgb: '0, 112, 243',
    rgba: '0, 112, 243, 95',
    light: '#4999F4',
    dark: '#0059BF',
    darker: '#003673',
    grey: '#224873',
    triad: '#1163A6',
  },
  red: {
    hex: '#FF736F',
    rgb: '255, 115, 111',
    rgba: '255, 115, 111, 100',
  },
  purple: {
    hex: '#A15EE0',
    rgb: '161, 94, 224',
    rgba: '161, 94, 224, 88',
  },
  green: {
    hex: '#92DEB6',
    rgb: '146, 222, 182',
    rgba: '146, 222, 182, 87',
  },
  yellow: {
    hex: '#E3FAA0',
    rgb: '227, 250, 160',
    rgba: '227, 250, 160, 98',
  }
}

export const colors3 = {
  blue: {
    primary: '#0071F2',
    light: '#4999F4',
    dark: '#0059BF',
    darker: '#003673',
    grey: '#224873',
  },
  red: {
    primary: '#FA565F',
    light: '#FBA0A5',
    dark: '#C7444A',
    darker: '#7A2A2E',
    grey: '#7A4E51',
  },
  green: {
    //primary: '#56DB9D',
    primary: '#5EDB70',
    light: '#A4E1AE',
    dark: '#48A857',
    darker: '#275C2F',
    grey: '#435C47'
  },
}

export const Container = styled.div`
  /*padding: 2.5em;
  text-align: start;*/
  margin: 0 auto;
	padding: 1.25rem 2rem;
	text-align: start;
  
  h1, h2, h3, h4, h5 {
    margin-top: 2rem;
  }
	
	// xs
  @media (min-width: 0) {
    max-width: 480px;
  }
	
	// sm
	@media (min-width: 600px) {
    max-width: 960px;
		padding: 1.25rem 3rem;
  }
	
	// md
	@media (min-width: 1024px) {
    max-width: 1280px;
		padding: 2rem 4rem;
  }
	
	// lg
	@media (min-width: 1600px) {
    //max-width: 1920px;
		//padding: 2rem 22rem;
  }
	
	// xl
	@media (min-width: 2048px) {
    //max-width: 3840px;
    //padding: 2rem 12rem;
  }
	
`;

export const Button = styled.button`
  background-color: ${colors3.blue.primary};
  border: none;
  color: white;
  padding: 0rem 2rem;
  text-align: center;
  display: flex;
  font-size: 0.8em;
  border-radius: 4px;
  border: 1px solid ${colors3.blue.dark};
  margin: 0.15rem 0;
  
  &:hover {
    background-color: ${colors3.blue.dark};
    color: white;
    transition: 0.35s;
    transform: scale(1.005);
  }
`;

export const ModalButton = styled(Button)`
  margin-top: 2rem;
`;

export const TextParagrah = styled.p`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const FormInput = styled.input`
  outline: none;
  width: 100%;
  border: none;
  border-radius: 4px;
  height: 40px;
`;

export const FormTextarea = styled.textarea`
  outline: none;
  width: 100%;
  border: none;
  border-radius: 4px;
  //height: 38px;
`;

export const FormSelect = styled.select`
  outline: none;
  width: 100%;
  border: none;
  border-radius: 4px;
  height: 40px;
`;

export const Wrapper = styled.div`
  margin-bottom: 2rem;
  margin-top: 2rem;
  
  h1, h2, h3, h4, h5, p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;