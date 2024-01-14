import React, { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

// https://github.com/KRRISH96/react-portal-overlay/blob/main/src/components/ReactPortal.js

function createWrapperAndAppendToBody(wrapperId) {
	const wrapperEl = document.createElement('div');
	wrapperEl.setAttribute('id', wrapperId);
	document.body.appendChild(wrapperEl);
	return wrapperEl;
}

export default function ReactPortal({ children, wrapperId = 'react-portal-wrapper' }) {
	const [wrapperEl, setWrapperEl] = useState(null);
	
	useLayoutEffect(() => {
		let element = document.getElementById(wrapperId);
		let systemCreated = false;
		// If element is not found with wrapperId or wrapperId is not provided, create and append to body
		
		if (!element) {
			systemCreated = true;
			element = createWrapperAndAppendToBody(wrapperId);
		}
		
		setWrapperEl(element);
		
		return () => {
			// Delete the programatically created element
			if (systemCreated && element.parentNode) {
				element.parentNode.removeChild(element);
			}
		}
	}, [wrapperId]);
	
	// wrapperEl state will be null on very first render
	if (wrapperEl === null) return null;
	
	return createPortal(children, wrapperEl);
}