import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const ProductWithReview = new GraphQLObjectType({	description: 'An instance of ProductWithReview',
	name: 'ProductWithReview',
	sqlTable: '(SELECT product.*, review.nr as review_nr FROM product inner join review on product.nr = review.product)',
	uniqueKey: ['nr'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['nr'],
		sqlExpr: table => `'http://lingbm.linkeddata.es/product_with_review/' || ${table}.nr || ''`
		},
		propertyTex4:{
			type: GraphQLString,
			sqlColumn: 'propertyTex4'
		},
		propertyNum5:{
			type: GraphQLString,
			sqlColumn: 'propertyNum5'
		},
		propertyTex6:{
			type: GraphQLString,
			sqlColumn: 'propertyTex6'
		},
		label:{
			type: GraphQLString,
			sqlColumn: 'label'
		},
		producer:{
			type: new GraphQLList(Producer),
			args: {
				identifier:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/producer/' || ${table}.nr || '' = '${args.identifier}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.producer = ${parent}.nr`
		},
		propertyNum3:{
			type: GraphQLString,
			sqlColumn: 'propertyNum3'
		},
		propertyNum1:{
			type: GraphQLString,
			sqlColumn: 'propertyNum1'
		},
		publishDate:{
			type: GraphQLString,
			sqlColumn: 'publishDate'
		},
		propertyNum4:{
			type: GraphQLString,
			sqlColumn: 'propertyNum4'
		},
		propertyTex3:{
			type: GraphQLString,
			sqlColumn: 'propertyTex3'
		},
		nr:{
			type: GraphQLString,
			sqlColumn: 'nr'
		},
		publisher:{
			type: GraphQLString,
			sqlColumn: 'publisher'
		},
		propertyNum6:{
			type: GraphQLString,
			sqlColumn: 'propertyNum6'
		},
		propertyTex1:{
			type: GraphQLString,
			sqlColumn: 'propertyTex1'
		},
		comment:{
			type: GraphQLString,
			sqlColumn: 'comment'
		},
		propertyTex2:{
			type: GraphQLString,
			sqlColumn: 'propertyTex2'
		},
		propertyNum2:{
			type: GraphQLString,
			sqlColumn: 'propertyNum2'
		},
		propertyTex5:{
			type: GraphQLString,
			sqlColumn: 'propertyTex5'
		},
		review:{
			type: new GraphQLList(Review),
			args: {
				identifier:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/review/' || ${table}.nr || '' = '${args.identifier}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.review_nr = ${parent}.nr`
		}
	})
})
export default ProductWithReview
import Producer from './Producer'
import Review from './Review'