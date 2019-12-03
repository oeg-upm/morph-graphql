import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const ProductWithReviews = new GraphQLObjectType({	description: 'An instance of ProductWithReviews',
	name: 'ProductWithReviews',
	sqlTable: '(SELECT product.*, review.nr as review_nr FROM product inner join review on product.nr = review.product)',
	uniqueKey: ['nr'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['nr'],
		sqlExpr: table => `'http://lingbm.linkeddata.es/product_with_review/' || ${table}.nr || ''`
		},
		publishDate:{
			type: GraphQLString,
			sqlColumn: 'publishDate'
		},
		propertyNum1:{
			type: GraphQLString,
			sqlColumn: 'propertyNum1'
		},
		propertyTex1:{
			type: GraphQLString,
			sqlColumn: 'propertyTex1'
		},
		propertyTex5:{
			type: GraphQLString,
			sqlColumn: 'propertyTex5'
		},
		reviews:{
			type: new GraphQLList(Review),
			args: {
				identifier:{type:GraphQLString},
				reviewDate:{type:GraphQLString},
				rating2:{type:GraphQLString},
				publisher:{type:GraphQLString},
				rating3:{type:GraphQLString},
				title:{type:GraphQLString},
				rating1:{type:GraphQLString},
				rating4:{type:GraphQLString},
				text:{type:GraphQLString},
				nr:{type:GraphQLString},
				language:{type:GraphQLString},
				publishDate:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/review/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.reviewDate != null) { sqlWhere.push(`${table}.reviewDate = '${args.reviewDate}'`) }
				if(args.rating2 != null) { sqlWhere.push(`${table}.rating2 = '${args.rating2}'`) }
				if(args.product != null) { sqlWhere.push(`null`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				if(args.reviewFor != null) { sqlWhere.push(`null`) }
				if(args.rating3 != null) { sqlWhere.push(`${table}.rating3 = '${args.rating3}'`) }
				if(args.title != null) { sqlWhere.push(`${table}.title = '${args.title}'`) }
				if(args.rating1 != null) { sqlWhere.push(`${table}.rating1 = '${args.rating1}'`) }
				if(args.rating4 != null) { sqlWhere.push(`${table}.rating4 = '${args.rating4}'`) }
				if(args.text != null) { sqlWhere.push(`${table}.text = '${args.text}'`) }
				if(args.producer != null) { sqlWhere.push(`null`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.language != null) { sqlWhere.push(`${table}.language = '${args.language}'`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				if(args.reviewer != null) { sqlWhere.push(`null`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.review_nr = ${parent}.nr`
		},
		label:{
			type: GraphQLString,
			sqlColumn: 'label'
		},
		propertyTex4:{
			type: GraphQLString,
			sqlColumn: 'propertyTex4'
		},
		propertyNum2:{
			type: GraphQLString,
			sqlColumn: 'propertyNum2'
		},
		propertyTex3:{
			type: GraphQLString,
			sqlColumn: 'propertyTex3'
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
		propertyNum4:{
			type: GraphQLString,
			sqlColumn: 'propertyNum4'
		},
		propertyNum6:{
			type: GraphQLString,
			sqlColumn: 'propertyNum6'
		},
		comment:{
			type: GraphQLString,
			sqlColumn: 'comment'
		},
		propertyTex6:{
			type: GraphQLString,
			sqlColumn: 'propertyTex6'
		},
		propertyTex2:{
			type: GraphQLString,
			sqlColumn: 'propertyTex2'
		},
		propertyNum5:{
			type: GraphQLString,
			sqlColumn: 'propertyNum5'
		},
		propertyNum3:{
			type: GraphQLString,
			sqlColumn: 'propertyNum3'
		},
		publisher:{
			type: GraphQLString,
			sqlColumn: 'publisher'
		},
		nr:{
			type: GraphQLString,
			sqlColumn: 'nr'
		}
	})
})
export default ProductWithReviews
import Review from './Review'
import Producer from './Producer'