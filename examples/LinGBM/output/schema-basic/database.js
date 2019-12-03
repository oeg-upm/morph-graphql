import path from 'path'
const dataFilePath = path.join(__dirname, '../data/LinGBM1000.db')
export default require('knex')({
	client: 'sqlite3',
	connection: {filename: dataFilePath},
	useNullAsDefault: true
})
