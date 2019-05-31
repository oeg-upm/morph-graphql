import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const Person = new GraphQLObjectType({	description: 'An instance of Person',
	name: 'Person',
	sqlTable: 'authors',
	uniqueKey: 'id',
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['id'],
		sqlExpr: table => `'http://ex.org/Person/' || ${table}.id || ''`
		},
		name:{
			type: GraphQLString,
			sqlDeps: ['fname','lname'],
		sqlExpr: table => `'' || ${table}.fname || ' ' || ${table}.lname || ''`
		},
		email:{
			type: GraphQLString,
			sqlColumn: 'email'
		}
	})
})
export default Person
