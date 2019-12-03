import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const Country = new GraphQLObjectType({	description: 'An instance of Country',
	name: 'Country',
	sqlTable: '(SELECT DISTINCT country AS code FROM person)',
	uniqueKey: ['code'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['code'],
		sqlExpr: table => `'http://lingbm.linkeddata.es/country/' || ${table}.code || ''`
		},
		code:{
			type: GraphQLString,
			sqlColumn: 'code'
		}
	})
})
export default Country
