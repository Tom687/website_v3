import knex from 'knex';

let connection;

if (process.env.NODE_ENV === 'production') {
	connection = {
		host: process.env.PGHOST,
		port: process.env.PGPORT,
		user: process.env.PGUSER,
		password: process.env.PGPASSWORD,
		database: process.env.PGDATABASE,
	}
}
else {
	connection = process.env.POSTGRES_URI
}

export default knex({
	client: 'pg',
	connection//: process.env.POSTGRES_URI
	//connection: {
	//	host: process.env.PGHOST,
	//	port: process.env.PGPORT,
	//	user: process.env.PGUSER,
	//	password: process.env.PGPASSWORD,
	//	database: process.env.PGDATABASE,
	//}
});