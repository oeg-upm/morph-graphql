import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt} from 'graphql'
import joinMonster from 'join-monster'
import knex from './database'
import dbCall from '../data/fetch'
import SocialMediaPosting from './SocialMediaPosting'
import Person from './Person'
export default new GraphQLObjectType({
	description: 'global query object',
	name: 'Query',
	fields: () => ({
		version: {
			type: GraphQLString,
			resolve: () => joinMonster.version },
		SocialMediaPosting: {
			type: new GraphQLList(SocialMediaPosting),
			args: {
				identifier:{type:GraphQLString},
				comment:{type:GraphQLString},
				date:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://ex.org/Comment/' || ${table}.id || '' = '${args.identifier}'`) }
				if(args.comment != null) { sqlWhere.push(`${table}.comment = '${args.comment}'`) }
				if(args.author != null) { sqlWhere.push(`null`) }
				if(args.date != null) { sqlWhere.push(`${table}.date = '${args.date}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		Person: {
			type: new GraphQLList(Person),
			args: {
				identifier:{type:GraphQLString},
				name:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://ex.org/Person/' || ${table}.id || '' = '${args.identifier}'`) }
				if(args.name != null) { sqlWhere.push(`${table}.name = '${args.name}'`) }
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
