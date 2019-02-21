import {GraphQLObjectType,GraphQLList,GraphQLNonNull,GraphQLString,GraphQLInt,GraphQLFloat} from 'graphql'
import knex from './database'
const Appears = new GraphQLObjectType({	description: 'An instance of Appears',
	name: 'Appears',
	sqlTable: 'appears',
	uniqueKey: ['charid','episodeid'],
	fields: () => ({
		identifier:{
			type: GraphQLString,
			sqlDeps: ['charid','episodeid'],
		sqlExpr: table => `'http://starwars.mappingpedia.linkeddata.es/movie/' || ${table}.charid || '/' || ${table}.episodeid || ''`
		},
		episode:{
			type: new GraphQLList(Episode),
			args: {
				identifier:{type:GraphQLString},
				code:{type:GraphQLString}
			},
			where: (table, args, context) => {
				let sqlWhere = []
				if(args.identifier != null) { sqlWhere.push(`'http://starwars.mappingpedia.linkeddata.es/episode/' || ${table}.id || '' = '${args.identifier}'`) }
				if(args.code != null) { sqlWhere.push(`${table}.code = '${args.code}'`) }
				let sqlWhereString = sqlWhere.join(" AND ")
				console.log(`sqlWhereString = ${sqlWhereString}`)
				return sqlWhereString
			},
			sqlJoin: (child, parent) => `${child}.episodeid = ${parent}.id`
		}
	})
})
export default Appears
import Episode from './Episode'