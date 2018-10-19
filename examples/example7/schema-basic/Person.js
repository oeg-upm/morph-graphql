import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql'

import knex from './database'
import SocialMediaPosting from './SocialMediaPosting'

const Person = new GraphQLObjectType({
  description: 'an instance of schema:Person',
  name: 'Person',
  // tell join monster the expression for the table
  sqlTable: 'personas',
  // one of the columns must be unique for deduplication purposes
  uniqueKey: 'id',
  fields: () => ({
    id: {
      // no `sqlColumn` and no `resolve`. assumed that the column name is the same as the field name: id
      type: GraphQLInt
    },
    telephone: {
      sqlColumn: 'telephone',
      type: GraphQLInt
    },
    identifier: {
      // no `sqlColumn` and no `resolve`. assumed that the column name is the same as the field name: id
      type: GraphQLString,
      // depends on multiple SQL columns
      sqlDeps: [ 'id', 'apellido' ],
      resolve: table => `http://ex.org/Person/${table.id}`
    },    
    givenName: {
      type: GraphQLString,
      // specify the SQL column
      sqlColumn: 'nombre'
    },
    familyName: {
      type: GraphQLString,
      // specify the SQL column
      sqlColumn: 'apellido'
    },
    fullNameJS: {
      description: 'A user\'s first and last name',
      type: GraphQLString,
      // depends on multiple SQL columns
      sqlDeps: [ 'nombre', 'apellido' ],
      resolve: user => `${user.nombre} ${user.apellido}`
    },
    fullNameDB: {
      type: GraphQLString,
      // or you could use a raw SQL expression
      sqlExpr: table => `${table}.nombre || ' ' || ${table}.apellido`
    },
    email: {
      description: 'A user\'s email',
      type: GraphQLString,
      // depends on multiple SQL columns
      sqlExpr: table => `lower(substr(${table}.nombre,1,1) || ${table}.apellido || '@fi.upm.es')`
    }
  })
})

export default Person 

function toBase64(clear) {
  return Buffer.from(String(clear)).toString('base64')
}
