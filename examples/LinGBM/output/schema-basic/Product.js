import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const Product = new GraphQLObjectType({	description: 'An instance of Product',
	name: 'Product',
	sqlTable: 'product',
	uniqueKey: ['nr'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['nr'],
		sqlExpr: table => `'http://lingbm.linkeddata.es/product/' || ${table}.nr || ''`
		},
		propertyNum3:{
			type: GraphQLString,
			sqlColumn: 'propertyNum3'
		},
		propertyTex3:{
			type: GraphQLString,
			sqlColumn: 'propertyTex3'
		},
		propertyNum6:{
			type: GraphQLString,
			sqlColumn: 'propertyNum6'
		},
		propertyTex5:{
			type: GraphQLString,
			sqlColumn: 'propertyTex5'
		},
		comment:{
			type: GraphQLString,
			sqlColumn: 'comment'
		},
		producer:{
			type: new GraphQLList(Producer),
			args: {
				identifier:{type:GraphQLString},
				nr:{type:GraphQLString},
				homepage:{type:GraphQLString},
				comment:{type:GraphQLString},
				publishDate:{type:GraphQLString},
				publisher:{type:GraphQLString},
				label:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/producer/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.homepage != null) { sqlWhere.push(`${table}.homepage = '${args.homepage}'`) }
				if(args.comment != null) { sqlWhere.push(`${table}.comment = '${args.comment}'`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				if(args.country != null) { sqlWhere.push(`null`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				if(args.label != null) { sqlWhere.push(`${table}.label = '${args.label}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.producer = ${parent}.nr`
		},
		propertyTex4:{
			type: GraphQLString,
			sqlColumn: 'propertyTex4'
		},
		propertyTex6:{
			type: GraphQLString,
			sqlColumn: 'propertyTex6'
		},
		label:{
			type: GraphQLString,
			sqlColumn: 'label'
		},
		propertyNum4:{
			type: GraphQLString,
			sqlColumn: 'propertyNum4'
		},
		propertyTex2:{
			type: GraphQLString,
			sqlColumn: 'propertyTex2'
		},
		nr:{
			type: GraphQLString,
			sqlColumn: 'nr'
		},
		publishDate:{
			type: GraphQLString,
			sqlColumn: 'publishDate'
		},
		propertyNum1:{
			type: GraphQLString,
			sqlColumn: 'propertyNum1'
		},
		propertyNum5:{
			type: GraphQLString,
			sqlColumn: 'propertyNum5'
		},
		propertyTex1:{
			type: GraphQLString,
			sqlColumn: 'propertyTex1'
		},
		publisher:{
			type: GraphQLString,
			sqlColumn: 'publisher'
		},
		propertyNum2:{
			type: GraphQLString,
			sqlColumn: 'propertyNum2'
		}
	})
})
export default Product
import Producer from './Producer'