// https://www.educative.io/answers/how-to-edit-text-on-double-click-in-reactjs
import { useCallback, useEffect, useRef } from 'react';
import useToggle from '../../hooks/useToggle';
import useInput from '../../hooks/useInput';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import useKeyPress from '../../hooks/useKeyPress';
import styled from 'styled-components';
import { Button } from '../styles/generalStyles';
import useDetectDevice from '../../hooks/useDetectDevice';

export default function InlineEditInput({
  initialValue,
  setInitialValue,
  elementType = 'input',
  type = 'text',
  rows = 5,
  name,
  onSave,
  deleteIfEmpty = false,
  setTouch,
  touch,
}) {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const inputRef = useRef(null);

  const { status: expanded, toggleStatus } = useToggle();
  const { value, onChange } = useInput(initialValue);

  const enter = useKeyPress('Enter');
  const esc = useKeyPress('Escape');
  const tab = useKeyPress('Tab');

  const { isMobile } = useDetectDevice();

  //inputRef.target = inputRef.current;

  // TODO : Submit event (onSave(event))
  const setValues = (value) => {
    onChange(value);
    setInitialValue(value);
    inputRef.target = inputRef.current;
    //inputRef.target = inputRef.current;
    onSave({ name: inputRef.target.name, value: inputRef.target.value });
  };

  const resetValues = (resetValue) => {
    onChange(resetValue);
  };

  const validateAndSetValues = (initialValue, value) => {
    // Save the value and close the editor
    if (value.trim() === '') {
      if (deleteIfEmpty) {
        setValues('');
      }
      else {
        resetValues(initialValue.trim());
        /*if (isMobile && touch) {
          setTouch(false);
        }*/
      }
    }
    else if (initialValue !== value.trim()) {
      setValues(value.trim());
    }
    toggleStatus();
    /*if (touch) {
      setTouch(false);
    }*/
    if (isMobile && touch) {
      setTouch(false);
    }
  };

  useOnClickOutside(wrapperRef, () => {
    if (expanded || touch) {
      validateAndSetValues(initialValue, value);
    }
  });

  // Pour save et display après enter : handleFormChange()
  const onEnter = useCallback(() => {
    if (enter && elementType !== 'textarea') {
      validateAndSetValues(initialValue, value);
    }
  }, [enter, value, onChange]);

  const onEscape = useCallback(() => {
    if (esc) {
      resetValues(initialValue);
      if (isMobile) {
        setTouch(false);
      }
      toggleStatus();
    }
  }, [esc, initialValue]);

  const onTab = useCallback(() => {
    if (tab) {
      validateAndSetValues(initialValue, value);
    }
  }, [tab, value, onChange]);

  useEffect(() => {
    if (inputRef && inputRef.current && (expanded || (isMobile && touch))) {
      // Use this to place cursor at the end of the textarea edit box
      if (elementType === 'textarea') {
        inputRef.current.setSelectionRange(value.length, value.length);
      }
      inputRef.current.focus();
    }
  }, [expanded, touch, isMobile, inputRef]);

  useEffect(() => {
    if (expanded || touch) {
      onTab();
      onEnter();
      onEscape();
    }
  }, [onEnter, onEscape, onTab, expanded, touch]);

  const handleSubmit = (e) => {
    console.log('handle');
    //e.preventDefault();
    validateAndSetValues(initialValue, value);
  };

  return (

    // Render span element
    <TextWrapper ref={wrapperRef}>
      { // Use JavaScript's ternary operator to specify <span>'s inner content
        (expanded || touch) ? elementType !== 'textarea' ?
          (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              autoFocus
              ref={inputRef}
            />
          ) : (
            <textarea
              name={name}
              value={value}
              onChange={onChange}
              rows={rows}
              autoFocus
              ref={inputRef}
            />
          ) : (

          <TextWrapper
            ref={textRef}
            onDoubleClick={toggleStatus}
          >
			{value}
				</TextWrapper>
        )
      }
      {
        (expanded || touch) &&
        <EditButton type="button" onClick={handleSubmit}>Edit</EditButton>
      }
    </TextWrapper>
  );
}

const EditButton = styled(Button)`
  margin: 0;
  border-radius: 0;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  place-items: center;
  white-space: nowrap;
  align-self: normal;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-display: row;
  width: 100%;
  //justify-content: center;
  align-self: normal;
  align-items: center;

  input, textarea {
    // TODO : Utiliser max-width ? (Voir vue mobile)
    width: 80%;
    //display: flex;
    //flex-grow: 1; // TODO : Pas bon avec mobile
    outline: none;
    border: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`;