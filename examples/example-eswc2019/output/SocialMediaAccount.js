import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const SocialMediaAccount = new GraphQLObjectType({	description: 'An instance of SocialMediaAccount',
	name: 'SocialMediaAccount',
	sqlTable: 'accounts',
	uniqueKey: 'id',
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['id'],
		sqlExpr: table => `'http://ex.org/Account/' || ${table}.id || ''`
		},
		username:{
			type: GraphQLString,
			sqlColumn: 'username'
		},
		accountType:{
			type: GraphQLString,
			sqlColumn: 'account_type'
		},
		belongsTo:{
			type: Person,
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
			sqlJoin: (child, parent) => `${child}.userid = ${parent}.id`
		}
	})
})
export default SocialMediaAccount
import Person from './Person'