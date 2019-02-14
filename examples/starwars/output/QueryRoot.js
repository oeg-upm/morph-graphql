import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt} from 'graphql'
import joinMonster from 'join-monster'
import knex from './database'
import dbCall from '../data/fetch'
import Appears from './Appears'
import CharacterType from './CharacterType'
import Character from './Character'
import Episode from './Episode'
export default new GraphQLObjectType({
	description: 'global query object',
	name: 'Query',
	fields: () => ({
		version: {
			type: GraphQLString,
			resolve: () => joinMonster.version },
		Appears: {
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
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		CharacterType: {
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
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		Character: {
			type: new GraphQLList(Character),
			args: {
				identifier:{type:GraphQLString},
				name:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://starwars.mappingpedia.linkeddata.es/character/' || ${table}.id || '' = '${args.identifier}'`) }
				if(args.name != null) { sqlWhere.push(`'' || ${table}.fname || ' ' || ${table}.lname || '' = '${args.name}'`) }
				if(args.type != null) { sqlWhere.push(`null`) }
				if(args.appearsIn != null) { sqlWhere.push(`null`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		Episode: {
			type: new GraphQLList(Episode),
			args: {
				identifier:{type:GraphQLString},
				code:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://starwars.mappingpedia.linkeddata.es/episode/' || ${table}.id || '' = '${args.identifier}'`) }
				if(args.code != null) { sqlWhere.push(`${table}.code = '${args.code}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}

	})
})
