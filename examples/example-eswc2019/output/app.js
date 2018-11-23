const db = require('sqlite');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const Promise = require('bluebird');
const uuid = require('uuid');

var { buildSchema } = require('graphql');

var schema = buildSchema(`
	type Query {
		SocialMediaPosting(identifier:String,comment:String,date:String): [SocialMediaPosting]
		Person(identifier:String,name:String): [Person]
	}

	type Mutation {
		createSocialMediaPosting(comment:String,date:String): SocialMediaPosting
		createPerson(name:String): Person
	}

	type SocialMediaPosting {
		identifier:String
		comment:String
		date:String
	}

	type Person {
		identifier:String
		name:String
	}

`);
class SocialMediaPosting {
}
class Person {
}

var root = { 
	SocialMediaPosting: function({identifier,comment,date}) {
		let sqlSelectFrom = `SELECT 'http://ex.org/Comment/' || id || '' AS tm0b094e70,comment AS comment,date AS date FROM comments`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm0b094e70 = '"+ identifier +"'") }
		if(comment != null) { sqlWhere.push("comment = '"+ comment +"'") }
		if(date != null) { sqlWhere.push("date = '"+ date +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new SocialMediaPosting();
				instance.identifier = `${row["tm0b094e70"]}`
				instance.comment = row["comment"];
				instance.date = row["date"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	Person: function({identifier,name}) {
		let sqlSelectFrom = `SELECT 'http://ex.org/Person/' || id || '' AS tm45a14d84,name AS name FROM authors`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm45a14d84 = '"+ identifier +"'") }
		if(name != null) { sqlWhere.push("name = '"+ name +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Person();
				instance.identifier = `${row["tm45a14d84"]}`
				instance.name = row["name"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
	,
	createSocialMediaPosting: function({comment,date}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(comment == undefined) { comment = 'NULL'}	
		if(date == undefined) { date = 'NULL'}	
		let sqlInsert = `INSERT INTO comments(comment,date) VALUES('${comment}','${date}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new SocialMediaPosting()
		newInstance.comment = comment
		newInstance.date = date
		return newInstance
	}
,
	createPerson: function({name}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(name == undefined) { name = 'NULL'}	
		let sqlInsert = `INSERT INTO authors(name) VALUES('${name}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Person()
		newInstance.name = name
		return newInstance
	}

};
const app = express();
const port = process.env.PORT || 4321;
app.use('/graphql', graphqlHTTP({schema: schema,  rootValue: root,  graphiql: true,}));
Promise.resolve().then(() => db.open('exampleeswc2019', { Promise }))
	.catch(err => console.error(err.stack))
	.finally(() => app.listen(port));

console.log('Running a GraphQL API server at localhost:4321/graphql');
