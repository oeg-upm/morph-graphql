import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const Vendor = new GraphQLObjectType({	description: 'An instance of Vendor',
	name: 'Vendor',
	sqlTable: 'vendor',
	uniqueKey: ['nr'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['nr'],
		sqlExpr: table => `'http://lingbm.linkeddata.es/vendor/' || ${table}.nr || ''`
		},
		nr:{
			type: GraphQLString,
			sqlColumn: 'nr'
		},
		homepage:{
			type: GraphQLString,
			sqlColumn: 'homepage'
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
		publishDate:{
			type: GraphQLString,
			sqlColumn: 'publishDate'
		},
		comment:{
			type: GraphQLString,
			sqlColumn: 'comment'
		},
		label:{
			type: GraphQLString,
			sqlColumn: 'label'
		},
		publisher:{
			type: GraphQLString,
			sqlColumn: 'publisher'
		}
	})
})
export default Vendor
import Country from './Country'