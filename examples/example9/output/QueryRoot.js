import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt} from 'graphql'
import joinMonster from 'join-monster'
import knex from './database'
import dbCall from '../data/fetch'
import SocialMediaPosting from './SocialMediaPosting'
import SocialMediaAccount from './SocialMediaAccount'
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
				if(args.date != null) { sqlWhere.push(`${table}.date = '${args.date}'`) }
				if(args.author != null) { sqlWhere.push(`null`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		SocialMediaAccount: {
			type: new GraphQLList(SocialMediaAccount),
			args: {
				identifier:{type:GraphQLString},
				username:{type:GraphQLString},
				accountType:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://ex.org/Account/' || ${table}.id || '' = '${args.identifier}'`) }
				if(args.username != null) { sqlWhere.push(`${table}.username = '${args.username}'`) }
				if(args.accountType != null) { sqlWhere.push(`${table}.account_type = '${args.accountType}'`) }
				if(args.belongsTo != null) { sqlWhere.push(`null`) }
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
				name:{type:GraphQLString},
				email:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://ex.org/Person/' || ${table}.id || '' = '${args.identifier}'`) }
				if(args.name != null) { sqlWhere.push(`'' || ${table}.fname || ' ' || ${table}.lname || '' = '${args.name}'`) }
				if(args.email != null) { sqlWhere.push(`${table}.email = '${args.email}'`) }
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
