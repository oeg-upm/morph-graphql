import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const Episode = new GraphQLObjectType({	description: 'An instance of Episode',
	name: 'Episode',
	sqlTable: 'episodes',
	uniqueKey: ['id'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['id'],
		sqlExpr: table => `'http://starwars.mappingpedia.linkeddata.es/episode/' || ${table}.id || ''`
		},
		code:{
			type: GraphQLString,
			sqlColumn: 'code'
		}
	})
})
export default Episode
