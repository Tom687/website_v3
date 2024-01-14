import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { FormInput, FormSelect, FormTextarea, ModalButton } from '../styles/generalStyles';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

export default function SelectModal({ isOpen, handleClose, title, onInsert }) {
	useLockBodyScroll();

	const { register, handleSubmit, formState: { errors } } = useForm();
	
	return (
			<StyledForm onSubmit={handleSubmit(onInsert)}>
				<FormGroup>
					<label htmlFor="event-title">Titre</label>
					<FormInput type="text" maxLength="100" id="event-title"
					       name="title"
					       { ...register('title') }
					/>
				</FormGroup>
				<FormGroup>
					<label htmlFor="event-descr">Description</label>
					{/*<input type="text" maxLength="600" id="event-descr" />*/}
					<FormTextarea
						cols="30"
						rows="1"
						name="description"
						{ ...register('description') }
					/>
				</FormGroup>
				<FormGroup>
					<label htmlFor="event-type">Type</label>
					{/*<input type="text" maxLength="40" id="event-type" />*/}
					{/* TODO : Fetch les types depuis la DB ? */}
					<FormSelect id="event-type"
					        name="type"
					        { ...register('type') }
					>
						<option value="staff">Staff</option>
						<option value="planning">Planning</option>
						<option value="client">Client</option>
						<option value="fournisseur">Fournisseur</option>
						<option value="maladie">Maladie</option>
						<option value="conges">Congés</option>
					</FormSelect>
				</FormGroup>
				<FormGroup>
					<label htmlFor="event-status">Status</label>
					{/* TODO : Fetch les status depuis la DB ? */}
					<FormSelect id="event-status"
					        name="status"
					        { ...register('status') }
					>
						<option value="attente">En attente</option>
						<option value="confirme">Confirmé</option>
						<option value="passe">Passé</option>
						<option value="annule">Annulé</option>
						<option value="du">A payer</option>
						<option value="paye">Payé</option>
					</FormSelect>
				</FormGroup>
				{ // FIXME !!!!!!
					//+!selectedEvent.id &&
					<ModalButton type="submit">Nouvel event</ModalButton>
				}
				{
					//+selectedEvent.id &&
					/*<Button type="submit">Modifier event</Button>*/
				}
			</StyledForm>
	);
}

const StyledForm = styled.form`
	display: flex;
	flex-direction: column;
	font-size: 0.75em;
`;

const FormGroup = styled.div`
  display: flex;
	flex-direction: column;
`;