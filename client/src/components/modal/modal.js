import React, {useEffect, useRef } from 'react';
import { CSSTransition } from "react-transition-group";
import ReactPortal from '../reactPortal';
import './modalStyles.css';
import styled from 'styled-components';
import { colors3 } from '../styles/generalStyles';

//https://github.com/KRRISH96/react-portal-overlay/blob/main/src/components/Modal/Modal.js

export default function Modal({ isOpen, handleClose, title, children }) {
	const nodeRef = useRef(null);
	
	useEffect(() => {
		const closeOnEscape = e => (e.key === 'Escape')  ? handleClose() : null;
		
		document.addEventListener('keydown', closeOnEscape);
		
		return () => {
			document.body.removeEventListener('keydown', closeOnEscape);
		}
	}, [handleClose]);
	
	return (
		<ReactPortal wrapperId="modal">
			<CSSTransition
				in={isOpen}
				timeout={{ entry: 0, exit: 300 }}
				unmountOnExit
				classNames="modal"
				nodeRef={nodeRef}
			>
					<div className="modal" ref={nodeRef}>
						<ModalWrapper
							//ref={nodeRef} // TODO : Useful ?
						>
							<ModalHeader className="modal-drag-handle">
								<h1>
									{ title && title }
								</h1>
								<nav>
									<button
										onClick={handleClose}
									>
										&times;
									</button>
								</nav>
							</ModalHeader>
							<ModalBody>
								<ModalContent>
									{ children }
								</ModalContent>
							</ModalBody>
						</ModalWrapper>
					</div>
			</CSSTransition>
		</ReactPortal>
	);
}

const ModalWrapper = styled.div`
  display: flex;
	flex-direction: column;
	flex-wrap: wrap;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: inherit;
  //width: 100%;
	min-height: 120px;
	//padding: 1rem; // FIXME : Si padding, décale la modal sur la droite
  background-color: ${colors3.blue.light};
  color: #fff;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
	width: 85%;
	margin: 0 auto;
`;

const ModalContent = styled.div`
	padding: 2rem;
	width: 100%;
	word-break: break-word;
`;

const ModalHeader = styled.header`
  position: relative;
  top: 0;
  //left: 0;
  //height: 18px;
	height: 2rem;
  //border: 1px dotted;
  width: auto;
  display: flex;
  //background-color: rgba(0, 0, 0, 0.3);
  background-color: ${colors3.blue.primary};
	width: 85%;
	margin: 0 auto;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;

  h1 {
    display: flex;
    font-size: 1rem;
    padding: 0;
    margin: auto 1rem;
    flex-grow: 1;
  }

  nav {
    // TODO : theme : buttonWidth, buttonIconWidth (theme.sizes.windowHeader.buttonWidth), fontSize, background, color
    display: flex;

    button {
      display: flex;
      place-content: center;
      place-items: center;
      background-color: transparent;
      width: 20px;
      border-left: 1px solid;
      box-sizing: content-box; // TODO : A quoi ça sert ?
			background-color: ${colors3.blue.primary};


      svg {
        fill: black;
        margin: 0 1px 2px 0;
        height: inherit;
        width: 36px;
      }

      &:hover {
        background-color: red;
				transition: 0.3s;

        svg {
          fill: ${colors3.red.light};
        }

        &.close {
          background-color: red;
          transition: background-color 0.25s ease;
        }
      }

      &:active {
        background-color: rgb(51, 51, 51);

        &.close {
          background-color: rgb(139, 10, 20);
        }
      }
    }

  }
`;