import { useState, useCallback, useMemo } from 'react';

// https://paladini.dev/posts/how-to-make-an-extremely-reusable-tooltip-component-with-react--and-nothing-else/
// https://usehooks.com/useToggle/

export default function useToggle() {
	const [status, setStatus] = useState(false);
	
	const toggleStatus = useCallback(() => {
		setStatus(prevState => !prevState);
	}, [])
	
	const values = useMemo(
		() => ({
			status,
			toggleStatus
		}),
		[status, toggleStatus]
	);
	
	return values;
}