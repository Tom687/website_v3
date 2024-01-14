import YouTube from 'react-youtube';
import { colors3, Container, TextParagrah, Wrapper } from '../styles/generalStyles';
//import CV from '../../assets/img/cv.pdf';
import CV from '../../assets/img/cv.png';
import { CardWrapper } from '../styles/docStyles';

export default function AboutMe() {
	const onReady = (event) => {
		// access to player in all event handlers via event.target
		event.target.pauseVideo();
	};

	return (
		<Container>
			<h1>A propos de moi :</h1>
			<TextParagrah>
				Je suis un développeur FullStack PERN (Postgres, Express, React, Node.js),
				plutôt spécialisé du côté backend (creation d'API RESTful ainsi que leurs documentations, traitement et utilisation de bases de données,…).
			</TextParagrah>
			<TextParagrah>
				Passionné, curieux, minutieux, persévérant et ayant toujours l'envie d'en apprendre toujours plus sont les qualités qui m'ont permis d'apprendre le développement web majoritairement en autodidacte.
			</TextParagrah>
			<TextParagrah>
				Passionné de roller depuis toujours mais ne pouvant plus en faire suite à de nombreuses blessures, ma passion se porte maintenant sur le développement web. Je vous prie de regarder ma dernière vidéo de roller ci-dessous, qui vous donnera, je n'en doute pas, une très bonne idée de la persévérance dont je fais part.
			</TextParagrah>
			<Wrapper>
				<h3>Mon CV : <a href={CV} target={'_blank'}>Lien externe</a></h3>
				<img src={CV} alt="CV Tom Pomarede" width={'100%'} height={'auto'} style={{ border: `1px solid ${colors3.blue.light}`}}/>
			</Wrapper>
			<Wrapper>
				<h3>Ma vidéo de roller :</h3>
				<YouTube
					videoId="bq2P_R67DbA"
					opts={{
						height: '390',
						width: '640',
					}} />
			</Wrapper>
		</Container>
	);
}