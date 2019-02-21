import path from 'path'
const dataFilePath = path.join(__dirname, '../data/example-starwars.sqlite')
export default require('knex')({
	client: 'sqlite3',
	connection: {filename: dataFilePath},
	useNullAsDefault: true
})
