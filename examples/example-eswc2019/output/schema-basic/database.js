import path from 'path'
const dataFilePath = path.join(__dirname, '../data/exampleeswc2019')
export default require('knex')({
	client: 'sqlite3',
	connection: {filename: dataFilePath},
	useNullAsDefault: true
})
