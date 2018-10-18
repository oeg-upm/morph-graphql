import path from 'path'

// connect to our database file
const dataFilePath = path.join(__dirname, '../data/example7.sqlite')

// knex is a convenient library that can connect to various SQL databases
// you can use any library you wish
export default require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dataFilePath
  },
  useNullAsDefault: true
})
