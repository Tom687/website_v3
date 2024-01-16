import styled from 'styled-components'

export default function FormInput({
  label,
  type = 'text',
  name,
  id,
  placeholder,
  required = false,
  register,
  errors,
  className,
}) {
  return (
    <InputGroup className={className}>
      {
        label && <label htmlFor={id ? id : name}>{label}</label>
      }
      <input
        type={type}
        name={name}
        id={id ? id : name}
        placeholder={placeholder ? placeholder : label}
        required={required}
        //className={className}
        {...register(name)}
      />
      {errors && errors[name] && <span>{errors[name].message}</span>}
    </InputGroup>
  )
}

const InputGroup = styled.div`
  display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
	
	label {
    display: flex;
		margin-bottom: 0.5rem;
    font-weight: bold;
		font-size: 14px;
	}
	
	input {
		padding: 0.5rem 0.75rem;
		width: 100%;
		font-size: 1rem;
	}
`