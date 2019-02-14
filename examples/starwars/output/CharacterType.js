import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const CharacterType = new GraphQLObjectType({	description: 'An instance of CharacterType',
	name: 'CharacterType',
	sqlTable: 'types',
	uniqueKey: ['id'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['id'],
		sqlExpr: table => `'http://starwars.mappingpedia.linkeddata.es/type/' || ${table}.id || ''`
		},
		name:{
			type: GraphQLString,
			sqlColumn: 'name'
		}
	})
})
export default CharacterType
