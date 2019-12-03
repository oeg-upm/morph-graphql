import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const Producer = new GraphQLObjectType({	description: 'An instance of Producer',
	name: 'Producer',
	sqlTable: 'producer',
	uniqueKey: ['nr'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['nr'],
		sqlExpr: table => `'http://lingbm.linkeddata.es/producer/' || ${table}.nr || ''`
		},
		nr:{
			type: GraphQLString,
			sqlColumn: 'nr'
		},
		homepage:{
			type: GraphQLString,
			sqlColumn: 'homepage'
		},
		comment:{
			type: GraphQLString,
			sqlColumn: 'comment'
		},
		publishDate:{
			type: GraphQLString,
			sqlColumn: 'publishDate'
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
		publisher:{
			type: GraphQLString,
			sqlColumn: 'publisher'
		},
		label:{
			type: GraphQLString,
			sqlColumn: 'label'
		}
	})
})
export default Producer
import Country from './Country'