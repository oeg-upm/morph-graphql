import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const Character = new GraphQLObjectType({	description: 'An instance of Character',
	name: 'Character',
	sqlTable: 'characters',
	uniqueKey: ['id'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['id'],
		sqlExpr: table => `'http://starwars.mappingpedia.linkeddata.es/character/' || ${table}.id || ''`
		},
		name:{
			type: GraphQLString,
			sqlDeps: ['fname','lname'],
		sqlExpr: table => `'' || ${table}.fname || ' ' || ${table}.lname || ''`
		},
		type:{
			type: new GraphQLList(CharacterType),
			args: {
				identifier:{type:GraphQLString},
				name:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://starwars.mappingpedia.linkeddata.es/type/' || ${table}.id || '' = '${args.identifier}'`) }
				if(args.name != null) { sqlWhere.push(`${table}.name = '${args.name}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.typeid = ${parent}.id`
		},
		appearsIn:{
			type: new GraphQLList(Appears),
			args: {
				identifier:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://starwars.mappingpedia.linkeddata.es/movie/' || ${table}.charid || '/' || ${table}.episodeid || '' = '${args.identifier}'`) }
				if(args.episode != null) { sqlWhere.push(`null`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.id = ${parent}.charid`
		}
	})
})
export default Character
import CharacterType from './CharacterType'
import Appears from './Appears'