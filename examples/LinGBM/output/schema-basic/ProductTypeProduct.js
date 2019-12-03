import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const ProductTypeProduct = new GraphQLObjectType({	description: 'An instance of ProductTypeProduct',
	name: 'ProductTypeProduct',
	sqlTable: 'producttypeproduct',
	uniqueKey: ['product','productType'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['product','productType'],
		sqlExpr: table => `'http://lingbm.linkeddata.es/producttypeproduct/' || ${table}.product || '/' || ${table}.productType || ''`
		},
		productWithReviews:{
			type: new GraphQLList(ProductWithReviews),
			args: {
				identifier:{type:GraphQLString},
				publishDate:{type:GraphQLString},
				propertyNum1:{type:GraphQLString},
				propertyTex1:{type:GraphQLString},
				propertyTex5:{type:GraphQLString},
				label:{type:GraphQLString},
				propertyTex4:{type:GraphQLString},
				propertyNum2:{type:GraphQLString},
				propertyTex3:{type:GraphQLString},
				propertyNum4:{type:GraphQLString},
				propertyNum6:{type:GraphQLString},
				comment:{type:GraphQLString},
				propertyTex6:{type:GraphQLString},
				propertyTex2:{type:GraphQLString},
				propertyNum5:{type:GraphQLString},
				propertyNum3:{type:GraphQLString},
				publisher:{type:GraphQLString},
				nr:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/product_with_review/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				if(args.propertyNum1 != null) { sqlWhere.push(`${table}.propertyNum1 = '${args.propertyNum1}'`) }
				if(args.propertyTex1 != null) { sqlWhere.push(`${table}.propertyTex1 = '${args.propertyTex1}'`) }
				if(args.propertyTex5 != null) { sqlWhere.push(`${table}.propertyTex5 = '${args.propertyTex5}'`) }
				if(args.label != null) { sqlWhere.push(`${table}.label = '${args.label}'`) }
				if(args.propertyTex4 != null) { sqlWhere.push(`${table}.propertyTex4 = '${args.propertyTex4}'`) }
				if(args.propertyNum2 != null) { sqlWhere.push(`${table}.propertyNum2 = '${args.propertyNum2}'`) }
				if(args.propertyTex3 != null) { sqlWhere.push(`${table}.propertyTex3 = '${args.propertyTex3}'`) }
				if(args.propertyNum4 != null) { sqlWhere.push(`${table}.propertyNum4 = '${args.propertyNum4}'`) }
				if(args.propertyNum6 != null) { sqlWhere.push(`${table}.propertyNum6 = '${args.propertyNum6}'`) }
				if(args.comment != null) { sqlWhere.push(`${table}.comment = '${args.comment}'`) }
				if(args.propertyTex6 != null) { sqlWhere.push(`${table}.propertyTex6 = '${args.propertyTex6}'`) }
				if(args.propertyTex2 != null) { sqlWhere.push(`${table}.propertyTex2 = '${args.propertyTex2}'`) }
				if(args.propertyNum5 != null) { sqlWhere.push(`${table}.propertyNum5 = '${args.propertyNum5}'`) }
				if(args.propertyNum3 != null) { sqlWhere.push(`${table}.propertyNum3 = '${args.propertyNum3}'`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.product = ${parent}.nr`
		},
		product:{
			type: new GraphQLList(Product),
			args: {
				identifier:{type:GraphQLString},
				propertyNum3:{type:GraphQLString},
				propertyTex3:{type:GraphQLString},
				propertyNum6:{type:GraphQLString},
				propertyTex5:{type:GraphQLString},
				comment:{type:GraphQLString},
				propertyTex4:{type:GraphQLString},
				propertyTex6:{type:GraphQLString},
				label:{type:GraphQLString},
				propertyNum4:{type:GraphQLString},
				propertyTex2:{type:GraphQLString},
				nr:{type:GraphQLString},
				publishDate:{type:GraphQLString},
				propertyNum1:{type:GraphQLString},
				propertyNum5:{type:GraphQLString},
				propertyTex1:{type:GraphQLString},
				publisher:{type:GraphQLString},
				propertyNum2:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/product/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.propertyNum3 != null) { sqlWhere.push(`${table}.propertyNum3 = '${args.propertyNum3}'`) }
				if(args.propertyTex3 != null) { sqlWhere.push(`${table}.propertyTex3 = '${args.propertyTex3}'`) }
				if(args.propertyNum6 != null) { sqlWhere.push(`${table}.propertyNum6 = '${args.propertyNum6}'`) }
				if(args.propertyTex5 != null) { sqlWhere.push(`${table}.propertyTex5 = '${args.propertyTex5}'`) }
				if(args.comment != null) { sqlWhere.push(`${table}.comment = '${args.comment}'`) }
				if(args.propertyTex4 != null) { sqlWhere.push(`${table}.propertyTex4 = '${args.propertyTex4}'`) }
				if(args.propertyTex6 != null) { sqlWhere.push(`${table}.propertyTex6 = '${args.propertyTex6}'`) }
				if(args.label != null) { sqlWhere.push(`${table}.label = '${args.label}'`) }
				if(args.propertyNum4 != null) { sqlWhere.push(`${table}.propertyNum4 = '${args.propertyNum4}'`) }
				if(args.propertyTex2 != null) { sqlWhere.push(`${table}.propertyTex2 = '${args.propertyTex2}'`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				if(args.propertyNum1 != null) { sqlWhere.push(`${table}.propertyNum1 = '${args.propertyNum1}'`) }
				if(args.propertyNum5 != null) { sqlWhere.push(`${table}.propertyNum5 = '${args.propertyNum5}'`) }
				if(args.propertyTex1 != null) { sqlWhere.push(`${table}.propertyTex1 = '${args.propertyTex1}'`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				if(args.propertyNum2 != null) { sqlWhere.push(`${table}.propertyNum2 = '${args.propertyNum2}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.product = ${parent}.nr`
		},
		producttype:{
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
			sqlJoin: (child, parent) => `${child}.productType = ${parent}.nr`
		}
	})
})
export default ProductTypeProduct
import ProductWithReviews from './ProductWithReviews'
import Product from './Product'
import ProductType from './ProductType'