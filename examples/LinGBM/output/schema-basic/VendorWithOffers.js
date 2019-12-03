import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const VendorWithOffers = new GraphQLObjectType({	description: 'An instance of VendorWithOffers',
	name: 'VendorWithOffers',
	sqlTable: '(SELECT vendor.*, offer.nr AS offer_nr FROM vendor INNER JOIN offer WHERE vendor.nr = offer.vendor)',
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
		publishDate:{
			type: GraphQLString,
			sqlColumn: 'publishDate'
		},
		comment:{
			type: GraphQLString,
			sqlColumn: 'comment'
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
		label:{
			type: GraphQLString,
			sqlColumn: 'label'
		},
		publisher:{
			type: GraphQLString,
			sqlColumn: 'publisher'
		},
		offers:{
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
			sqlJoin: (child, parent) => `${child}.offer_nr = ${parent}.nr`
		}
	})
})
export default VendorWithOffers
import Country from './Country'
import Offer from './Offer'