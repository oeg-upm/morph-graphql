const db = require('sqlite');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const Promise = require('bluebird');
const uuid = require('uuid');

var { buildSchema } = require('graphql');

var schema = buildSchema(`
	type Query {
		listCountry(identifier:String,code:String): [Country]
		listProducer(identifier:String,nr:String,homepage:String,comment:String,publishDate:String,publisher:String,label:String): [Producer]
		listReview(identifier:String,reviewDate:String,rating2:String,publisher:String,rating3:String,title:String,rating1:String,rating4:String,text:String,nr:String,language:String,publishDate:String): [Review]
		listProductTypeProduct(identifier:String): [ProductTypeProduct]
		listProducerWithProduct(identifier:String,publisher:String,comment:String,label:String,nr:String,homepage:String,publishDate:String): [ProducerWithProduct]
		listPerson(identifier:String,publisher:String,name:String,nr:String,mbox_sha1sum:String,publishDate:String): [Person]
		listProductType(identifier:String,publisher:String,publishDate:String,nr:String,comment:String,label:String): [ProductType]
		listOffer(identifier:String,validTo:String,price:String,validFrom:String,publishDate:String,offerWebpage:String,deliveryDays:String,nr:String,publisher:String): [Offer]
		listProduct(identifier:String,propertyNum3:String,propertyTex3:String,propertyNum6:String,propertyTex5:String,comment:String,propertyTex4:String,propertyTex6:String,label:String,propertyNum4:String,propertyTex2:String,nr:String,publishDate:String,propertyNum1:String,propertyNum5:String,propertyTex1:String,publisher:String,propertyNum2:String): [Product]
		listProductWithReviews(identifier:String,publishDate:String,propertyNum1:String,propertyTex1:String,propertyTex5:String,label:String,propertyTex4:String,propertyNum2:String,propertyTex3:String,propertyNum4:String,propertyNum6:String,comment:String,propertyTex6:String,propertyTex2:String,propertyNum5:String,propertyNum3:String,publisher:String,nr:String): [ProductWithReviews]
		listVendor(identifier:String,nr:String,homepage:String,publishDate:String,comment:String,label:String,publisher:String): [Vendor]
		listVendorWithOffers(identifier:String,nr:String,homepage:String,publishDate:String,comment:String,label:String,publisher:String): [VendorWithOffers]
	}

	type Mutation {
		createCountry(code:String): Country
		createProducer(nr:String,homepage:String,comment:String,publishDate:String,publisher:String,label:String): Producer
		createReview(reviewDate:String,rating2:String,publisher:String,rating3:String,title:String,rating1:String,rating4:String,text:String,nr:String,language:String,publishDate:String): Review
		createProductTypeProduct(): ProductTypeProduct
		createProducerWithProduct(publisher:String,comment:String,label:String,nr:String,homepage:String,publishDate:String): ProducerWithProduct
		createPerson(publisher:String,name:String,nr:String,mbox_sha1sum:String,publishDate:String): Person
		createProductType(publisher:String,publishDate:String,nr:String,comment:String,label:String): ProductType
		createOffer(validTo:String,price:String,validFrom:String,publishDate:String,offerWebpage:String,deliveryDays:String,nr:String,publisher:String): Offer
		createProduct(propertyNum3:String,propertyTex3:String,propertyNum6:String,propertyTex5:String,comment:String,propertyTex4:String,propertyTex6:String,label:String,propertyNum4:String,propertyTex2:String,nr:String,publishDate:String,propertyNum1:String,propertyNum5:String,propertyTex1:String,publisher:String,propertyNum2:String): Product
		createProductWithReviews(publishDate:String,propertyNum1:String,propertyTex1:String,propertyTex5:String,label:String,propertyTex4:String,propertyNum2:String,propertyTex3:String,propertyNum4:String,propertyNum6:String,comment:String,propertyTex6:String,propertyTex2:String,propertyNum5:String,propertyNum3:String,publisher:String,nr:String): ProductWithReviews
		createVendor(nr:String,homepage:String,publishDate:String,comment:String,label:String,publisher:String): Vendor
		createVendorWithOffers(nr:String,homepage:String,publishDate:String,comment:String,label:String,publisher:String): VendorWithOffers
	}

	type Country {
		identifier:String
		code:String
	}

	type Producer {
		identifier:String
		nr:String
		homepage:String
		comment:String
		publishDate:String
		publisher:String
		label:String
	}

	type Review {
		identifier:String
		reviewDate:String
		rating2:String
		publisher:String
		rating3:String
		title:String
		rating1:String
		rating4:String
		text:String
		nr:String
		language:String
		publishDate:String
	}

	type ProductTypeProduct {
		identifier:String
	}

	type ProducerWithProduct {
		identifier:String
		publisher:String
		comment:String
		label:String
		nr:String
		homepage:String
		publishDate:String
	}

	type Person {
		identifier:String
		publisher:String
		name:String
		nr:String
		mbox_sha1sum:String
		publishDate:String
	}

	type ProductType {
		identifier:String
		publisher:String
		publishDate:String
		nr:String
		comment:String
		label:String
	}

	type Offer {
		identifier:String
		validTo:String
		price:String
		validFrom:String
		publishDate:String
		offerWebpage:String
		deliveryDays:String
		nr:String
		publisher:String
	}

	type Product {
		identifier:String
		propertyNum3:String
		propertyTex3:String
		propertyNum6:String
		propertyTex5:String
		comment:String
		propertyTex4:String
		propertyTex6:String
		label:String
		propertyNum4:String
		propertyTex2:String
		nr:String
		publishDate:String
		propertyNum1:String
		propertyNum5:String
		propertyTex1:String
		publisher:String
		propertyNum2:String
	}

	type ProductWithReviews {
		identifier:String
		publishDate:String
		propertyNum1:String
		propertyTex1:String
		propertyTex5:String
		label:String
		propertyTex4:String
		propertyNum2:String
		propertyTex3:String
		propertyNum4:String
		propertyNum6:String
		comment:String
		propertyTex6:String
		propertyTex2:String
		propertyNum5:String
		propertyNum3:String
		publisher:String
		nr:String
	}

	type Vendor {
		identifier:String
		nr:String
		homepage:String
		publishDate:String
		comment:String
		label:String
		publisher:String
	}

	type VendorWithOffers {
		identifier:String
		nr:String
		homepage:String
		publishDate:String
		comment:String
		label:String
		publisher:String
	}

`);
class Country {
}
class Producer {
}
class Review {
}
class ProductTypeProduct {
}
class ProducerWithProduct {
}
class Person {
}
class ProductType {
}
class Offer {
}
class Product {
}
class ProductWithReviews {
}
class Vendor {
}
class VendorWithOffers {
}

var root = { 
	listCountry: function({identifier,code}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/country/' || code || '' AS tm275e897c,code AS code FROM (SELECT DISTINCT country AS code FROM person)`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm275e897c = '"+ identifier +"'") }
		if(code != null) { sqlWhere.push("code = '"+ code +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Country();
				instance.identifier = `${row["tm275e897c"]}`
				instance.code = row["code"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listProducer: function({identifier,nr,homepage,comment,publishDate,publisher,label}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/producer/' || nr || '' AS tm10cb8220,nr AS nr,homepage AS homepage,comment AS comment,publishDate AS publishDate,publisher AS publisher,label AS label FROM producer`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm10cb8220 = '"+ identifier +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		if(homepage != null) { sqlWhere.push("homepage = '"+ homepage +"'") }
		if(comment != null) { sqlWhere.push("comment = '"+ comment +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		if(label != null) { sqlWhere.push("label = '"+ label +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Producer();
				instance.identifier = `${row["tm10cb8220"]}`
				instance.nr = row["nr"];
				instance.homepage = row["homepage"];
				instance.comment = row["comment"];
				instance.publishDate = row["publishDate"];
				instance.publisher = row["publisher"];
				instance.label = row["label"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listReview: function({identifier,reviewDate,rating2,publisher,rating3,title,rating1,rating4,text,nr,language,publishDate}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/review/' || nr || '' AS tm0e4d6718,reviewDate AS reviewDate,rating2 AS rating2,publisher AS publisher,rating3 AS rating3,title AS title,rating1 AS rating1,rating4 AS rating4,text AS text,nr AS nr,language AS language,publishDate AS publishDate FROM review`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm0e4d6718 = '"+ identifier +"'") }
		if(reviewDate != null) { sqlWhere.push("reviewDate = '"+ reviewDate +"'") }
		if(rating2 != null) { sqlWhere.push("rating2 = '"+ rating2 +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		if(rating3 != null) { sqlWhere.push("rating3 = '"+ rating3 +"'") }
		if(title != null) { sqlWhere.push("title = '"+ title +"'") }
		if(rating1 != null) { sqlWhere.push("rating1 = '"+ rating1 +"'") }
		if(rating4 != null) { sqlWhere.push("rating4 = '"+ rating4 +"'") }
		if(text != null) { sqlWhere.push("text = '"+ text +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		if(language != null) { sqlWhere.push("language = '"+ language +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Review();
				instance.identifier = `${row["tm0e4d6718"]}`
				instance.reviewDate = row["reviewDate"];
				instance.rating2 = row["rating2"];
				instance.publisher = row["publisher"];
				instance.rating3 = row["rating3"];
				instance.title = row["title"];
				instance.rating1 = row["rating1"];
				instance.rating4 = row["rating4"];
				instance.text = row["text"];
				instance.nr = row["nr"];
				instance.language = row["language"];
				instance.publishDate = row["publishDate"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listProductTypeProduct: function({identifier}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/producttypeproduct/' || product || '/' || productType || '' AS tm2cb7d392 FROM producttypeproduct`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm2cb7d392 = '"+ identifier +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new ProductTypeProduct();
				instance.identifier = `${row["tm2cb7d392"]}`
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listProducerWithProduct: function({identifier,publisher,comment,label,nr,homepage,publishDate}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/producer/' || nr || '' AS tm3ed965e6,publisher AS publisher,comment AS comment,label AS label,nr AS nr,homepage AS homepage,publishDate AS publishDate FROM (SELECT product.nr AS product, producer.* FROM producer INNER JOIN product WHERE producer.nr = product.producer)`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm3ed965e6 = '"+ identifier +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		if(comment != null) { sqlWhere.push("comment = '"+ comment +"'") }
		if(label != null) { sqlWhere.push("label = '"+ label +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		if(homepage != null) { sqlWhere.push("homepage = '"+ homepage +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new ProducerWithProduct();
				instance.identifier = `${row["tm3ed965e6"]}`
				instance.publisher = row["publisher"];
				instance.comment = row["comment"];
				instance.label = row["label"];
				instance.nr = row["nr"];
				instance.homepage = row["homepage"];
				instance.publishDate = row["publishDate"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listPerson: function({identifier,publisher,name,nr,mbox_sha1sum,publishDate}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/person/' || nr || '' AS tm788e9c13,publisher AS publisher,name AS name,nr AS nr,mbox_sha1sum AS mbox_sha1sum,publishDate AS publishDate FROM person`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm788e9c13 = '"+ identifier +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		if(name != null) { sqlWhere.push("name = '"+ name +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		if(mbox_sha1sum != null) { sqlWhere.push("mbox_sha1sum = '"+ mbox_sha1sum +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Person();
				instance.identifier = `${row["tm788e9c13"]}`
				instance.publisher = row["publisher"];
				instance.name = row["name"];
				instance.nr = row["nr"];
				instance.mbox_sha1sum = row["mbox_sha1sum"];
				instance.publishDate = row["publishDate"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listProductType: function({identifier,publisher,publishDate,nr,comment,label}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/producttype/' || nr || '' AS tm63a71ee5,publisher AS publisher,publishDate AS publishDate,nr AS nr,comment AS comment,label AS label FROM producttype`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm63a71ee5 = '"+ identifier +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		if(comment != null) { sqlWhere.push("comment = '"+ comment +"'") }
		if(label != null) { sqlWhere.push("label = '"+ label +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new ProductType();
				instance.identifier = `${row["tm63a71ee5"]}`
				instance.publisher = row["publisher"];
				instance.publishDate = row["publishDate"];
				instance.nr = row["nr"];
				instance.comment = row["comment"];
				instance.label = row["label"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listOffer: function({identifier,validTo,price,validFrom,publishDate,offerWebpage,deliveryDays,nr,publisher}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/offer/' || nr || '' AS tm652dae2f,validTo AS validTo,price AS price,validFrom AS validFrom,publishDate AS publishDate,offerWebpage AS offerWebpage,deliveryDays AS deliveryDays,nr AS nr,publisher AS publisher FROM offer`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm652dae2f = '"+ identifier +"'") }
		if(validTo != null) { sqlWhere.push("validTo = '"+ validTo +"'") }
		if(price != null) { sqlWhere.push("price = '"+ price +"'") }
		if(validFrom != null) { sqlWhere.push("validFrom = '"+ validFrom +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		if(offerWebpage != null) { sqlWhere.push("offerWebpage = '"+ offerWebpage +"'") }
		if(deliveryDays != null) { sqlWhere.push("deliveryDays = '"+ deliveryDays +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Offer();
				instance.identifier = `${row["tm652dae2f"]}`
				instance.validTo = row["validTo"];
				instance.price = row["price"];
				instance.validFrom = row["validFrom"];
				instance.publishDate = row["publishDate"];
				instance.offerWebpage = row["offerWebpage"];
				instance.deliveryDays = row["deliveryDays"];
				instance.nr = row["nr"];
				instance.publisher = row["publisher"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listProduct: function({identifier,propertyNum3,propertyTex3,propertyNum6,propertyTex5,comment,propertyTex4,propertyTex6,label,propertyNum4,propertyTex2,nr,publishDate,propertyNum1,propertyNum5,propertyTex1,publisher,propertyNum2}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/product/' || nr || '' AS tm045bb790,propertyNum3 AS propertyNum3,propertyTex3 AS propertyTex3,propertyNum6 AS propertyNum6,propertyTex5 AS propertyTex5,comment AS comment,propertyTex4 AS propertyTex4,propertyTex6 AS propertyTex6,label AS label,propertyNum4 AS propertyNum4,propertyTex2 AS propertyTex2,nr AS nr,publishDate AS publishDate,propertyNum1 AS propertyNum1,propertyNum5 AS propertyNum5,propertyTex1 AS propertyTex1,publisher AS publisher,propertyNum2 AS propertyNum2 FROM product`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm045bb790 = '"+ identifier +"'") }
		if(propertyNum3 != null) { sqlWhere.push("propertyNum3 = '"+ propertyNum3 +"'") }
		if(propertyTex3 != null) { sqlWhere.push("propertyTex3 = '"+ propertyTex3 +"'") }
		if(propertyNum6 != null) { sqlWhere.push("propertyNum6 = '"+ propertyNum6 +"'") }
		if(propertyTex5 != null) { sqlWhere.push("propertyTex5 = '"+ propertyTex5 +"'") }
		if(comment != null) { sqlWhere.push("comment = '"+ comment +"'") }
		if(propertyTex4 != null) { sqlWhere.push("propertyTex4 = '"+ propertyTex4 +"'") }
		if(propertyTex6 != null) { sqlWhere.push("propertyTex6 = '"+ propertyTex6 +"'") }
		if(label != null) { sqlWhere.push("label = '"+ label +"'") }
		if(propertyNum4 != null) { sqlWhere.push("propertyNum4 = '"+ propertyNum4 +"'") }
		if(propertyTex2 != null) { sqlWhere.push("propertyTex2 = '"+ propertyTex2 +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		if(propertyNum1 != null) { sqlWhere.push("propertyNum1 = '"+ propertyNum1 +"'") }
		if(propertyNum5 != null) { sqlWhere.push("propertyNum5 = '"+ propertyNum5 +"'") }
		if(propertyTex1 != null) { sqlWhere.push("propertyTex1 = '"+ propertyTex1 +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		if(propertyNum2 != null) { sqlWhere.push("propertyNum2 = '"+ propertyNum2 +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Product();
				instance.identifier = `${row["tm045bb790"]}`
				instance.propertyNum3 = row["propertyNum3"];
				instance.propertyTex3 = row["propertyTex3"];
				instance.propertyNum6 = row["propertyNum6"];
				instance.propertyTex5 = row["propertyTex5"];
				instance.comment = row["comment"];
				instance.propertyTex4 = row["propertyTex4"];
				instance.propertyTex6 = row["propertyTex6"];
				instance.label = row["label"];
				instance.propertyNum4 = row["propertyNum4"];
				instance.propertyTex2 = row["propertyTex2"];
				instance.nr = row["nr"];
				instance.publishDate = row["publishDate"];
				instance.propertyNum1 = row["propertyNum1"];
				instance.propertyNum5 = row["propertyNum5"];
				instance.propertyTex1 = row["propertyTex1"];
				instance.publisher = row["publisher"];
				instance.propertyNum2 = row["propertyNum2"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listProductWithReviews: function({identifier,publishDate,propertyNum1,propertyTex1,propertyTex5,label,propertyTex4,propertyNum2,propertyTex3,propertyNum4,propertyNum6,comment,propertyTex6,propertyTex2,propertyNum5,propertyNum3,publisher,nr}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/product_with_review/' || nr || '' AS tm22ab06af,publishDate AS publishDate,propertyNum1 AS propertyNum1,propertyTex1 AS propertyTex1,propertyTex5 AS propertyTex5,label AS label,propertyTex4 AS propertyTex4,propertyNum2 AS propertyNum2,propertyTex3 AS propertyTex3,propertyNum4 AS propertyNum4,propertyNum6 AS propertyNum6,comment AS comment,propertyTex6 AS propertyTex6,propertyTex2 AS propertyTex2,propertyNum5 AS propertyNum5,propertyNum3 AS propertyNum3,publisher AS publisher,nr AS nr FROM (SELECT product.*, review.nr as review_nr FROM product inner join review on product.nr = review.product)`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm22ab06af = '"+ identifier +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		if(propertyNum1 != null) { sqlWhere.push("propertyNum1 = '"+ propertyNum1 +"'") }
		if(propertyTex1 != null) { sqlWhere.push("propertyTex1 = '"+ propertyTex1 +"'") }
		if(propertyTex5 != null) { sqlWhere.push("propertyTex5 = '"+ propertyTex5 +"'") }
		if(label != null) { sqlWhere.push("label = '"+ label +"'") }
		if(propertyTex4 != null) { sqlWhere.push("propertyTex4 = '"+ propertyTex4 +"'") }
		if(propertyNum2 != null) { sqlWhere.push("propertyNum2 = '"+ propertyNum2 +"'") }
		if(propertyTex3 != null) { sqlWhere.push("propertyTex3 = '"+ propertyTex3 +"'") }
		if(propertyNum4 != null) { sqlWhere.push("propertyNum4 = '"+ propertyNum4 +"'") }
		if(propertyNum6 != null) { sqlWhere.push("propertyNum6 = '"+ propertyNum6 +"'") }
		if(comment != null) { sqlWhere.push("comment = '"+ comment +"'") }
		if(propertyTex6 != null) { sqlWhere.push("propertyTex6 = '"+ propertyTex6 +"'") }
		if(propertyTex2 != null) { sqlWhere.push("propertyTex2 = '"+ propertyTex2 +"'") }
		if(propertyNum5 != null) { sqlWhere.push("propertyNum5 = '"+ propertyNum5 +"'") }
		if(propertyNum3 != null) { sqlWhere.push("propertyNum3 = '"+ propertyNum3 +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new ProductWithReviews();
				instance.identifier = `${row["tm22ab06af"]}`
				instance.publishDate = row["publishDate"];
				instance.propertyNum1 = row["propertyNum1"];
				instance.propertyTex1 = row["propertyTex1"];
				instance.propertyTex5 = row["propertyTex5"];
				instance.label = row["label"];
				instance.propertyTex4 = row["propertyTex4"];
				instance.propertyNum2 = row["propertyNum2"];
				instance.propertyTex3 = row["propertyTex3"];
				instance.propertyNum4 = row["propertyNum4"];
				instance.propertyNum6 = row["propertyNum6"];
				instance.comment = row["comment"];
				instance.propertyTex6 = row["propertyTex6"];
				instance.propertyTex2 = row["propertyTex2"];
				instance.propertyNum5 = row["propertyNum5"];
				instance.propertyNum3 = row["propertyNum3"];
				instance.publisher = row["publisher"];
				instance.nr = row["nr"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listVendor: function({identifier,nr,homepage,publishDate,comment,label,publisher}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/vendor/' || nr || '' AS tmbeca036d,nr AS nr,homepage AS homepage,publishDate AS publishDate,comment AS comment,label AS label,publisher AS publisher FROM vendor`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tmbeca036d = '"+ identifier +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		if(homepage != null) { sqlWhere.push("homepage = '"+ homepage +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		if(comment != null) { sqlWhere.push("comment = '"+ comment +"'") }
		if(label != null) { sqlWhere.push("label = '"+ label +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new Vendor();
				instance.identifier = `${row["tmbeca036d"]}`
				instance.nr = row["nr"];
				instance.homepage = row["homepage"];
				instance.publishDate = row["publishDate"];
				instance.comment = row["comment"];
				instance.label = row["label"];
				instance.publisher = row["publisher"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
,
	listVendorWithOffers: function({identifier,nr,homepage,publishDate,comment,label,publisher}) {
		let sqlSelectFrom = `SELECT 'http://lingbm.linkeddata.es/vendor/' || nr || '' AS tm50190d2a,nr AS nr,homepage AS homepage,publishDate AS publishDate,comment AS comment,label AS label,publisher AS publisher FROM (SELECT vendor.*, offer.nr AS offer_nr FROM vendor INNER JOIN offer WHERE vendor.nr = offer.vendor)`
		let sqlWhere = []
		if(identifier != null) { sqlWhere.push("tm50190d2a = '"+ identifier +"'") }
		if(nr != null) { sqlWhere.push("nr = '"+ nr +"'") }
		if(homepage != null) { sqlWhere.push("homepage = '"+ homepage +"'") }
		if(publishDate != null) { sqlWhere.push("publishDate = '"+ publishDate +"'") }
		if(comment != null) { sqlWhere.push("comment = '"+ comment +"'") }
		if(label != null) { sqlWhere.push("label = '"+ label +"'") }
		if(publisher != null) { sqlWhere.push("publisher = '"+ publisher +"'") }
		let sql = "";
		if(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }
		let data = db.all(sql);
		console.log(`sql = ${sql}`)
		let allInstances = [];
		return data.then(rows => {
			rows.forEach((row) => {
				let instance = new VendorWithOffers();
				instance.identifier = `${row["tm50190d2a"]}`
				instance.nr = row["nr"];
				instance.homepage = row["homepage"];
				instance.publishDate = row["publishDate"];
				instance.comment = row["comment"];
				instance.label = row["label"];
				instance.publisher = row["publisher"];
				allInstances.push(instance);
			})
			return allInstances;
		});
	}
	,
	createCountry: function({code}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(code == undefined) { code = 'NULL'}	
		let sqlInsert = `INSERT INTO (SELECT DISTINCT country AS code FROM person)(code) VALUES('${code}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Country()
		newInstance.code = code
		return newInstance
	}
,
	createProducer: function({nr,homepage,comment,publishDate,publisher,label}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(nr == undefined) { nr = 'NULL'}	
		if(homepage == undefined) { homepage = 'NULL'}	
		if(comment == undefined) { comment = 'NULL'}	
		if(publishDate == undefined) { publishDate = 'NULL'}	
		if(publisher == undefined) { publisher = 'NULL'}	
		if(label == undefined) { label = 'NULL'}	
		let sqlInsert = `INSERT INTO producer(nr,homepage,comment,publishDate,publisher,label) VALUES('${nr}','${homepage}','${comment}','${publishDate}','${publisher}','${label}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Producer()
		newInstance.nr = nr
		newInstance.homepage = homepage
		newInstance.comment = comment
		newInstance.publishDate = publishDate
		newInstance.publisher = publisher
		newInstance.label = label
		return newInstance
	}
,
	createReview: function({reviewDate,rating2,publisher,rating3,title,rating1,rating4,text,nr,language,publishDate}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(reviewDate == undefined) { reviewDate = 'NULL'}	
		if(rating2 == undefined) { rating2 = 'NULL'}	
		if(publisher == undefined) { publisher = 'NULL'}	
		if(rating3 == undefined) { rating3 = 'NULL'}	
		if(title == undefined) { title = 'NULL'}	
		if(rating1 == undefined) { rating1 = 'NULL'}	
		if(rating4 == undefined) { rating4 = 'NULL'}	
		if(text == undefined) { text = 'NULL'}	
		if(nr == undefined) { nr = 'NULL'}	
		if(language == undefined) { language = 'NULL'}	
		if(publishDate == undefined) { publishDate = 'NULL'}	
		let sqlInsert = `INSERT INTO review(reviewDate,rating2,publisher,rating3,title,rating1,rating4,text,nr,language,publishDate) VALUES('${reviewDate}','${rating2}','${publisher}','${rating3}','${title}','${rating1}','${rating4}','${text}','${nr}','${language}','${publishDate}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Review()
		newInstance.reviewDate = reviewDate
		newInstance.rating2 = rating2
		newInstance.publisher = publisher
		newInstance.rating3 = rating3
		newInstance.title = title
		newInstance.rating1 = rating1
		newInstance.rating4 = rating4
		newInstance.text = text
		newInstance.nr = nr
		newInstance.language = language
		newInstance.publishDate = publishDate
		return newInstance
	}
,
	createProductTypeProduct: function({}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }

		let sqlInsert = `INSERT INTO producttypeproduct() VALUES()`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new ProductTypeProduct()

		return newInstance
	}
,
	createProducerWithProduct: function({publisher,comment,label,nr,homepage,publishDate}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(publisher == undefined) { publisher = 'NULL'}	
		if(comment == undefined) { comment = 'NULL'}	
		if(label == undefined) { label = 'NULL'}	
		if(nr == undefined) { nr = 'NULL'}	
		if(homepage == undefined) { homepage = 'NULL'}	
		if(publishDate == undefined) { publishDate = 'NULL'}	
		let sqlInsert = `INSERT INTO (SELECT product.nr AS product, producer.* FROM producer INNER JOIN product WHERE producer.nr = product.producer)(publisher,comment,label,nr,homepage,publishDate) VALUES('${publisher}','${comment}','${label}','${nr}','${homepage}','${publishDate}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new ProducerWithProduct()
		newInstance.publisher = publisher
		newInstance.comment = comment
		newInstance.label = label
		newInstance.nr = nr
		newInstance.homepage = homepage
		newInstance.publishDate = publishDate
		return newInstance
	}
,
	createPerson: function({publisher,name,nr,mbox_sha1sum,publishDate}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(publisher == undefined) { publisher = 'NULL'}	
		if(name == undefined) { name = 'NULL'}	
		if(nr == undefined) { nr = 'NULL'}	
		if(mbox_sha1sum == undefined) { mbox_sha1sum = 'NULL'}	
		if(publishDate == undefined) { publishDate = 'NULL'}	
		let sqlInsert = `INSERT INTO person(publisher,name,nr,mbox_sha1sum,publishDate) VALUES('${publisher}','${name}','${nr}','${mbox_sha1sum}','${publishDate}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Person()
		newInstance.publisher = publisher
		newInstance.name = name
		newInstance.nr = nr
		newInstance.mbox_sha1sum = mbox_sha1sum
		newInstance.publishDate = publishDate
		return newInstance
	}
,
	createProductType: function({publisher,publishDate,nr,comment,label}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(publisher == undefined) { publisher = 'NULL'}	
		if(publishDate == undefined) { publishDate = 'NULL'}	
		if(nr == undefined) { nr = 'NULL'}	
		if(comment == undefined) { comment = 'NULL'}	
		if(label == undefined) { label = 'NULL'}	
		let sqlInsert = `INSERT INTO producttype(publisher,publishDate,nr,comment,label) VALUES('${publisher}','${publishDate}','${nr}','${comment}','${label}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new ProductType()
		newInstance.publisher = publisher
		newInstance.publishDate = publishDate
		newInstance.nr = nr
		newInstance.comment = comment
		newInstance.label = label
		return newInstance
	}
,
	createOffer: function({validTo,price,validFrom,publishDate,offerWebpage,deliveryDays,nr,publisher}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(validTo == undefined) { validTo = 'NULL'}	
		if(price == undefined) { price = 'NULL'}	
		if(validFrom == undefined) { validFrom = 'NULL'}	
		if(publishDate == undefined) { publishDate = 'NULL'}	
		if(offerWebpage == undefined) { offerWebpage = 'NULL'}	
		if(deliveryDays == undefined) { deliveryDays = 'NULL'}	
		if(nr == undefined) { nr = 'NULL'}	
		if(publisher == undefined) { publisher = 'NULL'}	
		let sqlInsert = `INSERT INTO offer(validTo,price,validFrom,publishDate,offerWebpage,deliveryDays,nr,publisher) VALUES('${validTo}','${price}','${validFrom}','${publishDate}','${offerWebpage}','${deliveryDays}','${nr}','${publisher}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Offer()
		newInstance.validTo = validTo
		newInstance.price = price
		newInstance.validFrom = validFrom
		newInstance.publishDate = publishDate
		newInstance.offerWebpage = offerWebpage
		newInstance.deliveryDays = deliveryDays
		newInstance.nr = nr
		newInstance.publisher = publisher
		return newInstance
	}
,
	createProduct: function({propertyNum3,propertyTex3,propertyNum6,propertyTex5,comment,propertyTex4,propertyTex6,label,propertyNum4,propertyTex2,nr,publishDate,propertyNum1,propertyNum5,propertyTex1,publisher,propertyNum2}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(propertyNum3 == undefined) { propertyNum3 = 'NULL'}	
		if(propertyTex3 == undefined) { propertyTex3 = 'NULL'}	
		if(propertyNum6 == undefined) { propertyNum6 = 'NULL'}	
		if(propertyTex5 == undefined) { propertyTex5 = 'NULL'}	
		if(comment == undefined) { comment = 'NULL'}	
		if(propertyTex4 == undefined) { propertyTex4 = 'NULL'}	
		if(propertyTex6 == undefined) { propertyTex6 = 'NULL'}	
		if(label == undefined) { label = 'NULL'}	
		if(propertyNum4 == undefined) { propertyNum4 = 'NULL'}	
		if(propertyTex2 == undefined) { propertyTex2 = 'NULL'}	
		if(nr == undefined) { nr = 'NULL'}	
		if(publishDate == undefined) { publishDate = 'NULL'}	
		if(propertyNum1 == undefined) { propertyNum1 = 'NULL'}	
		if(propertyNum5 == undefined) { propertyNum5 = 'NULL'}	
		if(propertyTex1 == undefined) { propertyTex1 = 'NULL'}	
		if(publisher == undefined) { publisher = 'NULL'}	
		if(propertyNum2 == undefined) { propertyNum2 = 'NULL'}	
		let sqlInsert = `INSERT INTO product(propertyNum3,propertyTex3,propertyNum6,propertyTex5,comment,propertyTex4,propertyTex6,label,propertyNum4,propertyTex2,nr,publishDate,propertyNum1,propertyNum5,propertyTex1,publisher,propertyNum2) VALUES('${propertyNum3}','${propertyTex3}','${propertyNum6}','${propertyTex5}','${comment}','${propertyTex4}','${propertyTex6}','${label}','${propertyNum4}','${propertyTex2}','${nr}','${publishDate}','${propertyNum1}','${propertyNum5}','${propertyTex1}','${publisher}','${propertyNum2}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Product()
		newInstance.propertyNum3 = propertyNum3
		newInstance.propertyTex3 = propertyTex3
		newInstance.propertyNum6 = propertyNum6
		newInstance.propertyTex5 = propertyTex5
		newInstance.comment = comment
		newInstance.propertyTex4 = propertyTex4
		newInstance.propertyTex6 = propertyTex6
		newInstance.label = label
		newInstance.propertyNum4 = propertyNum4
		newInstance.propertyTex2 = propertyTex2
		newInstance.nr = nr
		newInstance.publishDate = publishDate
		newInstance.propertyNum1 = propertyNum1
		newInstance.propertyNum5 = propertyNum5
		newInstance.propertyTex1 = propertyTex1
		newInstance.publisher = publisher
		newInstance.propertyNum2 = propertyNum2
		return newInstance
	}
,
	createProductWithReviews: function({publishDate,propertyNum1,propertyTex1,propertyTex5,label,propertyTex4,propertyNum2,propertyTex3,propertyNum4,propertyNum6,comment,propertyTex6,propertyTex2,propertyNum5,propertyNum3,publisher,nr}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(publishDate == undefined) { publishDate = 'NULL'}	
		if(propertyNum1 == undefined) { propertyNum1 = 'NULL'}	
		if(propertyTex1 == undefined) { propertyTex1 = 'NULL'}	
		if(propertyTex5 == undefined) { propertyTex5 = 'NULL'}	
		if(label == undefined) { label = 'NULL'}	
		if(propertyTex4 == undefined) { propertyTex4 = 'NULL'}	
		if(propertyNum2 == undefined) { propertyNum2 = 'NULL'}	
		if(propertyTex3 == undefined) { propertyTex3 = 'NULL'}	
		if(propertyNum4 == undefined) { propertyNum4 = 'NULL'}	
		if(propertyNum6 == undefined) { propertyNum6 = 'NULL'}	
		if(comment == undefined) { comment = 'NULL'}	
		if(propertyTex6 == undefined) { propertyTex6 = 'NULL'}	
		if(propertyTex2 == undefined) { propertyTex2 = 'NULL'}	
		if(propertyNum5 == undefined) { propertyNum5 = 'NULL'}	
		if(propertyNum3 == undefined) { propertyNum3 = 'NULL'}	
		if(publisher == undefined) { publisher = 'NULL'}	
		if(nr == undefined) { nr = 'NULL'}	
		let sqlInsert = `INSERT INTO (SELECT product.*, review.nr as review_nr FROM product inner join review on product.nr = review.product)(publishDate,propertyNum1,propertyTex1,propertyTex5,label,propertyTex4,propertyNum2,propertyTex3,propertyNum4,propertyNum6,comment,propertyTex6,propertyTex2,propertyNum5,propertyNum3,publisher,nr) VALUES('${publishDate}','${propertyNum1}','${propertyTex1}','${propertyTex5}','${label}','${propertyTex4}','${propertyNum2}','${propertyTex3}','${propertyNum4}','${propertyNum6}','${comment}','${propertyTex6}','${propertyTex2}','${propertyNum5}','${propertyNum3}','${publisher}','${nr}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new ProductWithReviews()
		newInstance.publishDate = publishDate
		newInstance.propertyNum1 = propertyNum1
		newInstance.propertyTex1 = propertyTex1
		newInstance.propertyTex5 = propertyTex5
		newInstance.label = label
		newInstance.propertyTex4 = propertyTex4
		newInstance.propertyNum2 = propertyNum2
		newInstance.propertyTex3 = propertyTex3
		newInstance.propertyNum4 = propertyNum4
		newInstance.propertyNum6 = propertyNum6
		newInstance.comment = comment
		newInstance.propertyTex6 = propertyTex6
		newInstance.propertyTex2 = propertyTex2
		newInstance.propertyNum5 = propertyNum5
		newInstance.propertyNum3 = propertyNum3
		newInstance.publisher = publisher
		newInstance.nr = nr
		return newInstance
	}
,
	createVendor: function({nr,homepage,publishDate,comment,label,publisher}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(nr == undefined) { nr = 'NULL'}	
		if(homepage == undefined) { homepage = 'NULL'}	
		if(publishDate == undefined) { publishDate = 'NULL'}	
		if(comment == undefined) { comment = 'NULL'}	
		if(label == undefined) { label = 'NULL'}	
		if(publisher == undefined) { publisher = 'NULL'}	
		let sqlInsert = `INSERT INTO vendor(nr,homepage,publishDate,comment,label,publisher) VALUES('${nr}','${homepage}','${publishDate}','${comment}','${label}','${publisher}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new Vendor()
		newInstance.nr = nr
		newInstance.homepage = homepage
		newInstance.publishDate = publishDate
		newInstance.comment = comment
		newInstance.label = label
		newInstance.publisher = publisher
		return newInstance
	}
,
	createVendorWithOffers: function({nr,homepage,publishDate,comment,label,publisher}) {
		if(identifier == undefined) { identifier = uuid.v4().substring(0,8) }
		if(nr == undefined) { nr = 'NULL'}	
		if(homepage == undefined) { homepage = 'NULL'}	
		if(publishDate == undefined) { publishDate = 'NULL'}	
		if(comment == undefined) { comment = 'NULL'}	
		if(label == undefined) { label = 'NULL'}	
		if(publisher == undefined) { publisher = 'NULL'}	
		let sqlInsert = `INSERT INTO (SELECT vendor.*, offer.nr AS offer_nr FROM vendor INNER JOIN offer WHERE vendor.nr = offer.vendor)(nr,homepage,publishDate,comment,label,publisher) VALUES('${nr}','${homepage}','${publishDate}','${comment}','${label}','${publisher}')`
		let status = db.run(sqlInsert).then(dbStatus => { return dbStatus });
		console.log(`sql = ${sqlInsert}`)
		let newInstance = new VendorWithOffers()
		newInstance.nr = nr
		newInstance.homepage = homepage
		newInstance.publishDate = publishDate
		newInstance.comment = comment
		newInstance.label = label
		newInstance.publisher = publisher
		return newInstance
	}

};
const app = express();
const port = process.env.PORT || 4321;
app.use('/graphql', graphqlHTTP({schema: schema,  rootValue: root,  graphiql: true,}));
Promise.resolve().then(() => db.open('LinGBM1000.db', { Promise }))
	.catch(err => console.error(err.stack))
	.finally(() => app.listen(port));

console.log('Running a GraphQL API server at localhost:4321/graphql');
