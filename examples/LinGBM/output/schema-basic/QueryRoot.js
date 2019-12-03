import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt} from 'graphql'
import joinMonster from 'join-monster'
import knex from './database'
import dbCall from '../data/fetch'
import Country from './Country'
import Producer from './Producer'
import Review from './Review'
import ProductTypeProduct from './ProductTypeProduct'
import ProducerWithProduct from './ProducerWithProduct'
import Person from './Person'
import ProductType from './ProductType'
import Offer from './Offer'
import Product from './Product'
import ProductWithReviews from './ProductWithReviews'
import Vendor from './Vendor'
import VendorWithOffers from './VendorWithOffers'
export default new GraphQLObjectType({
	description: 'global query object',
	name: 'Query',
	fields: () => ({
		version: {
			type: GraphQLString,
			resolve: () => joinMonster.version },
		listCountry: {
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
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listProducer: {
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
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listReview: {
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
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listProductTypeProduct: {
			type: new GraphQLList(ProductTypeProduct),
			args: {
				identifier:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/producttypeproduct/' || ${table}.product || '/' || ${table}.productType || '' = '${args.identifier}'`) }
				if(args.productWithReviews != null) { sqlWhere.push(`null`) }
				if(args.product != null) { sqlWhere.push(`null`) }
				if(args.producttype != null) { sqlWhere.push(`null`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listProducerWithProduct: {
			type: new GraphQLList(ProducerWithProduct),
			args: {
				identifier:{type:GraphQLString},
				publisher:{type:GraphQLString},
				comment:{type:GraphQLString},
				label:{type:GraphQLString},
				nr:{type:GraphQLString},
				homepage:{type:GraphQLString},
				publishDate:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/producer/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				if(args.comment != null) { sqlWhere.push(`${table}.comment = '${args.comment}'`) }
				if(args.products != null) { sqlWhere.push(`null`) }
				if(args.label != null) { sqlWhere.push(`${table}.label = '${args.label}'`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.productWithReviews != null) { sqlWhere.push(`null`) }
				if(args.homepage != null) { sqlWhere.push(`${table}.homepage = '${args.homepage}'`) }
				if(args.country != null) { sqlWhere.push(`null`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listPerson: {
			type: new GraphQLList(Person),
			args: {
				identifier:{type:GraphQLString},
				publisher:{type:GraphQLString},
				name:{type:GraphQLString},
				nr:{type:GraphQLString},
				mbox_sha1sum:{type:GraphQLString},
				publishDate:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/person/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				if(args.name != null) { sqlWhere.push(`${table}.name = '${args.name}'`) }
				if(args.country != null) { sqlWhere.push(`null`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.mbox_sha1sum != null) { sqlWhere.push(`${table}.mbox_sha1sum = '${args.mbox_sha1sum}'`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listProductType: {
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
				if(args.parent != null) { sqlWhere.push(`null`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.comment != null) { sqlWhere.push(`${table}.comment = '${args.comment}'`) }
				if(args.label != null) { sqlWhere.push(`${table}.label = '${args.label}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listOffer: {
			type: new GraphQLList(Offer),
			args: {
				identifier:{type:GraphQLString},
				validTo:{type:GraphQLString},
				price:{type:GraphQLString},
				validFrom:{type:GraphQLString},
				publishDate:{type:GraphQLString},
				offerWebpage:{type:GraphQLString},
				deliveryDays:{type:GraphQLString},
				nr:{type:GraphQLString},
				publisher:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/offer/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.validTo != null) { sqlWhere.push(`${table}.validTo = '${args.validTo}'`) }
				if(args.producer != null) { sqlWhere.push(`null`) }
				if(args.price != null) { sqlWhere.push(`${table}.price = '${args.price}'`) }
				if(args.validFrom != null) { sqlWhere.push(`${table}.validFrom = '${args.validFrom}'`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				if(args.offerWebpage != null) { sqlWhere.push(`${table}.offerWebpage = '${args.offerWebpage}'`) }
				if(args.product != null) { sqlWhere.push(`null`) }
				if(args.deliveryDays != null) { sqlWhere.push(`${table}.deliveryDays = '${args.deliveryDays}'`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.vendor != null) { sqlWhere.push(`null`) }
				if(args.productWithReviews != null) { sqlWhere.push(`null`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listProduct: {
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
				if(args.producer != null) { sqlWhere.push(`null`) }
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
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listProductWithReviews: {
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
				if(args.reviews != null) { sqlWhere.push(`null`) }
				if(args.label != null) { sqlWhere.push(`${table}.label = '${args.label}'`) }
				if(args.propertyTex4 != null) { sqlWhere.push(`${table}.propertyTex4 = '${args.propertyTex4}'`) }
				if(args.propertyNum2 != null) { sqlWhere.push(`${table}.propertyNum2 = '${args.propertyNum2}'`) }
				if(args.propertyTex3 != null) { sqlWhere.push(`${table}.propertyTex3 = '${args.propertyTex3}'`) }
				if(args.producer != null) { sqlWhere.push(`null`) }
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
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listVendor: {
			type: new GraphQLList(Vendor),
			args: {
				identifier:{type:GraphQLString},
				nr:{type:GraphQLString},
				homepage:{type:GraphQLString},
				publishDate:{type:GraphQLString},
				comment:{type:GraphQLString},
				label:{type:GraphQLString},
				publisher:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/vendor/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.homepage != null) { sqlWhere.push(`${table}.homepage = '${args.homepage}'`) }
				if(args.country != null) { sqlWhere.push(`null`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				if(args.comment != null) { sqlWhere.push(`${table}.comment = '${args.comment}'`) }
				if(args.label != null) { sqlWhere.push(`${table}.label = '${args.label}'`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			resolve: (parent, args, context, resolveInfo) => {
				return joinMonster(resolveInfo, context, sql => dbCall(sql, knex, context))
			}
		}
,
		listVendorWithOffers: {
			type: new GraphQLList(VendorWithOffers),
			args: {
				identifier:{type:GraphQLString},
				nr:{type:GraphQLString},
				homepage:{type:GraphQLString},
				publishDate:{type:GraphQLString},
				comment:{type:GraphQLString},
				label:{type:GraphQLString},
				publisher:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://lingbm.linkeddata.es/vendor/' || ${table}.nr || '' = '${args.identifier}'`) }
				if(args.nr != null) { sqlWhere.push(`${table}.nr = '${args.nr}'`) }
				if(args.homepage != null) { sqlWhere.push(`${table}.homepage = '${args.homepage}'`) }
				if(args.publishDate != null) { sqlWhere.push(`${table}.publishDate = '${args.publishDate}'`) }
				if(args.comment != null) { sqlWhere.push(`${table}.comment = '${args.comment}'`) }
				if(args.country != null) { sqlWhere.push(`null`) }
				if(args.label != null) { sqlWhere.push(`${table}.label = '${args.label}'`) }
				if(args.publisher != null) { sqlWhere.push(`${table}.publisher = '${args.publisher}'`) }
				if(args.offers != null) { sqlWhere.push(`null`) }
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
