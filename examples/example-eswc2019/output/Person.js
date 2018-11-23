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
			resolve: table => `http://ex.org/Person/${table.id}`
		},
		name:{
			type: GraphQLString,
			sqlColumn: 'name'
		}
	})
})
export default Person
