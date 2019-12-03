import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const ProductType = new GraphQLObjectType({	description: 'An instance of ProductType',
	name: 'ProductType',
	sqlTable: 'producttype',
	uniqueKey: ['nr'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['nr'],
		sqlExpr: table => `'http://lingbm.linkeddata.es/producttype/' || ${table}.nr || ''`
		},
		parent:{
			type: new GraphQLList(ProductType),
			args: {
				identifier:{type:GraphQLString},
				publisher:{type:GraphQLString},
				publishDate:{type:GraphQLString},
				nr:{type:GraphQLString},
				comment:{type:GraphQLString},
				label:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/producttype/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.comment != null) { sqlWhere.push(`${table}.comment = '${args.comment}'`) }
				if(args.label != null) { sqlWhere.push(`${table}.label = '${args.label}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.parent = ${parent}.nr`
		},
		publisher:{
			type: GraphQLString,
			sqlColumn: 'publisher'
		},
		publishDate:{
			type: GraphQLString,
			sqlColumn: 'publishDate'
		},
		nr:{
			type: GraphQLString,
			sqlColumn: 'nr'
		},
		comment:{
			type: GraphQLString,
			sqlColumn: 'comment'
		},
		label:{
			type: GraphQLString,
			sqlColumn: 'label'
		}
	})
})
export default ProductType
