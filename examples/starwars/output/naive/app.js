const db = require('sqlite');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const Promise = require('bluebird');
const uuid = require('uuid');

var { buildSchema } = require('graphql');

var schema = buildSchema(`
	type Query {
		listFriendship(identifier:String,charid:String,friendId:String): [Friendship]
		listCharacter(identifier:String,name:String): [Character]
		listCharacterType(identifier:String,name:String): [CharacterType]
		listHeroes(identifier:String): [Heroes]
		listAppears(identifier:String): [Appears]
		listEpisode(identifier:String,code:String): [Episode]
	}

	type Mutation {
		createFriendship(charid:String,friendId:String): Friendship
		createCharacter(): Character
		createCharacterType(name:String): CharacterType
		createHeroes(): Heroes
		createAppears(): Appears
		createEpisode(code:String): Episode
	}

	type Friendship {
		identifier:String
		charid:String
		friendId:String
	}

	type Character {
		identifier:String
		name:String
	}

	type CharacterType {
		identifier:String
		name:String
	}

	type Heroes {
		identifier:String
	}

	type Appears {
		identifier:String
	}

	type Episode {
		identifier:String
		code:String
	}

`);
class Friendship {
}
class Character {
}
class CharacterType {
}
class Heroes {
}
class Appears {
}
class Episode {
	generateInstance(identifer, code) {
		let instance = new Episode();
		instance.identifier = identifer
		instance.code = code;
		allInstances.push(instance);
		return instance
	}
}

var root = { 
	listFriendship: function({identifier,charid,friendId}) {
		let sqlSelectFrom = `SELECT 'http://starwars.mappingpedia.linkeddata.es/friends/' || id || '/' || fid || '' AS tm7e6552bb,id AS id,fid AS fid FROM friends`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm7e6552bb = '"+ identifier +"'") }
		if(charid != null) { sqlWhere.push("id = '"+ charid +"'") }
		if(friendId != null) { sqlWhere.push("fid = '"+ friendId +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Friendship();
				instance.identifier = `${row["tm7e6552bb"]}`
				instance.charid = row["id"];
				instance.friendId = row["fid"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listCharacter: function({identifier,name}) {
		let sqlSelectFrom = `SELECT 'http://starwars.mappingpedia.linkeddata.es/character/' || id || '' AS tmd9af81e2,'' || fname || ' ' || lname || '' AS tmddf412db FROM characters`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tmd9af81e2 = '"+ identifier +"'") }
		if(name != null) { sqlWhere.push("tmddf412db = '"+ name +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Character();
				instance.identifier = `${row["tmd9af81e2"]}`
				instance.name = `${row["tmddf412db"]}`
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listCharacterType: function({identifier,name}) {
		let sqlSelectFrom = `SELECT 'http://starwars.mappingpedia.linkeddata.es/type/' || id || '' AS tm642ea1c3,name AS name FROM types`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm642ea1c3 = '"+ identifier +"'") }
		if(name != null) { sqlWhere.push("name = '"+ name +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new CharacterType();
				instance.identifier = `${row["tm642ea1c3"]}`
				instance.name = row["name"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listHeroes: function({identifier}) {
		let sqlSelectFrom = `SELECT 'http://starwars.mappingpedia.linkeddata.es/heroes/' || episodeid || '/' || charid || '' AS tm40da2156 FROM heroes`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm40da2156 = '"+ identifier +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Heroes();
				instance.identifier = `${row["tm40da2156"]}`
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listAppears: function({identifier}) {
		let sqlSelectFrom = `SELECT 'http://starwars.mappingpedia.linkeddata.es/movie/' || charid || '/' || episodeid || '' AS tm818cee44 FROM appears`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm818cee44 = '"+ identifier +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Appears();
				instance.identifier = `${row["tm818cee44"]}`
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listEpisode: function({identifier,code}) {
		let sqlSelectFrom = `SELECT 'http://starwars.mappingpedia.linkeddata.es/episode/' || id || '' AS tm8eb00529,code AS code FROM episodes`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm8eb00529 = '"+ identifier +"'") }
		if(code != null) { sqlWhere.push("code = '"+ code +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Episode();
				instance.identifier = `${row["tm8eb00529"]}`
				instance.code = row["code"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
	,
	createFriendship: function({charid,friendId}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(charid == undefined) { charid = 'NULL'}	
		if(friendId == undefined) { friendId = 'NULL'}	
		let sqlInsert = `INSERT INTO friends(id,fid) VALUES('${charid}','${friendId}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Friendship()
		newInstance.charid = charid
		newInstance.friendId = friendId
		return newInstance
	}
,
	createCharacter: function({}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }

		let sqlInsert = `INSERT INTO characters() VALUES()`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Character()

		return newInstance
	}
,
	createCharacterType: function({name}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(name == undefined) { name = 'NULL'}	
		let sqlInsert = `INSERT INTO types(name) VALUES('${name}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new CharacterType()
		newInstance.name = name
		return newInstance
	}
,
	createHeroes: function({}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }

		let sqlInsert = `INSERT INTO heroes() VALUES()`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Heroes()

		return newInstance
	}
,
	createAppears: function({}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }

		let sqlInsert = `INSERT INTO appears() VALUES()`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Appears()

		return newInstance
	}
,
	createEpisode: function({code}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(code == undefined) { code = 'NULL'}	
		let sqlInsert = `INSERT INTO episodes(code) VALUES('${code}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Episode()
		newInstance.code = code
		return newInstance
	}

};
const app = express();
const port = process.env.PORT || 4321;
app.use('/graphql', graphqlHTTP({schema: schema,  rootValue: root,  graphiql: true,}));
Promise.resolve().then(() => db.open('starwars', { Promise }))
	.catch(err => console.error(err.stack))
	.finally(() => app.listen(port));

console.log('Running a GraphQL API server at localhost:4321/graphql');
