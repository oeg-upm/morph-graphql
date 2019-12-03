import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const Person = new GraphQLObjectType({	description: 'An instance of Person',
	name: 'Person',
	sqlTable: 'person',
	uniqueKey: ['nr'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['nr'],
		sqlExpr: table => `'http://lingbm.linkeddata.es/person/' || ${table}.nr || ''`
		},
		publisher:{
			type: GraphQLString,
			sqlColumn: 'publisher'
		},
		name:{
			type: GraphQLString,
			sqlColumn: 'name'
		},
		country:{
			type: new GraphQLList(Country),
			args: {
				identifier:{type:GraphQLString},
				code:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/country/' || ${table}.code || '' = '${args.identifier}'`) }
				if(args.code != null) { sqlWhere.push(`${table}.code = '${args.code}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.country = ${parent}.code`
		},
		nr:{
			type: GraphQLString,
			sqlColumn: 'nr'
		},
		mbox_sha1sum:{
			type: GraphQLString,
			sqlColumn: 'mbox_sha1sum'
		},
		publishDate:{
			type: GraphQLString,
			sqlColumn: 'publishDate'
		}
	})
})
export default Person
import Country from './Country'