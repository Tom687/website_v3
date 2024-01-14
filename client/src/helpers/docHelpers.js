export const buildResponse = ({ status, message, data }) => {
	return `
		{
			${status ? 'status: ' + `"${status}"`  : 'status: "success"'},
			message: "${message}",
			${data}
		}
		`;
}

export const builNoDatadResponse = ({ status, message, data }) => {
	return `
		{
			${status ? 'status: ' + `"${status}"`  : 'status: "success"'},
			message: "${message}",
		}
		`;
}