package com.code.RMLtoGraphQL;

import java.util.List;

public class Templates {

	public Templates() {
		super();
	}

	public String getEndpointTemplate(List<Resource> resources) {
		String result = "package com.servidorGraphQL.code;\r\n\n";
		String mongo = "\tstatic {\r\n" +
				"\t\tMongoDatabase mongo = new MongoClient().getDatabase(\"<sourceName>\");\r\n";
		String attributes = "@WebServlet(urlPatterns = \"/graphql\")\r\n" + 
				"public class GraphQLEndpoint extends SimpleGraphQLServlet {\r\n" + 
				"\r\n" + 
				"\tprivate static final long serialVersionUID = 1L;\r\n";
		String resolvers = "";
		String arguments = "(";
		for(int i = 1; i < resources.size()+1; i++) {
			mongo += "\t\t<resourceVarName" + i + ">Repository = new <resourceName" + i + 
					">Repository(mongo.getCollection(\"<iteratorName" + i + ">\"));\r\n";
			attributes += "\tprivate static final <resourceName" + i + ">Repository <resourceVarName" + i + ">Repository;\r\n";
			arguments += "<resourceVarName" + i + ">Repository, "; 
			if(resources.get(i-1).isHaveRelation()) {
				resolvers += "\t\t\t\tnew <resourceName" + i + ">Resolver(";

				for(int j = 1; j < resources.get(i-1).getPredicates().size()+1; j++) {
					if(resources.get(i-1).getPredicates().get(j-1).getObject().getRelation() != null) {
						resolvers += "<resourceVarNameRelation" + i+j + ">Repository, ";
					}
				}
				resolvers = resolvers.substring(0, resolvers.length()-2);
				resolvers += "),\r\n";
			}
		}
		
		arguments = arguments.substring(0, arguments.length()-2);
		String arguments2 = arguments + "),\r\n";
		arguments += "),\r\n";
		if(!resolvers.isEmpty()) {
			resolvers = resolvers.substring(0, resolvers.length()-4);
		}
		else {
			arguments2 = arguments2.substring(0, arguments2.length()-4);
		}
		String build = "\tprivate static GraphQLSchema buildSchema() {\r\n" + 
				"\t\treturn SchemaParser.newParser()\r\n" + 
				"\t\t\t.file(\"schema.graphqls\")\r\n" + 
				"\t\t\t.resolvers(new Query" + arguments + "\t\t\t\tnew Mutation" + arguments2 +
				resolvers + "))\r\n" +
				"\t\t\t.build()\r\n" +
				"\t\t\t.makeExecutableSchema();\r\n" +
				"\t}\r\n\n";

		mongo += "\t}\r\n\n";
		attributes += "\n";
		result += getEndpointImports() + "\r\n\n" + attributes + mongo + 
				"\tpublic GraphQLEndpoint() {\r\n" + 
				"\t\tsuper(buildSchema());\r\n" + 
				"\t}\r\n\n" + build + getEndpointErrors() + "}";

		return result;
	}

	public String getQueryTemplate(List<Resource> resources) {
		String result = "package com.servidorGraphQL.code;\r\n" + 
				"\r\n" + 
				"import java.util.List;\r\n" + 
				"\r\n" + 
				"import com.coxautodev.graphql.tools.GraphQLRootResolver;\r\n" + 
				"\r\n" + 
				"public class Query implements GraphQLRootResolver {\r\n\n";
		String variables = "";
		String constructor = "\tpublic Query(";
		String constructor2 = "";
		String queries = "";

		for(int i = 1; i < resources.size()+1; i++) {
			variables += "\tprivate final <resourceName" + i + ">Repository <resourceVarName" + i + ">Repository;\r\n";
			constructor += "<resourceName" + i + ">Repository <resourceVarName" + i + ">Repository,\r\n";
			constructor2 += "\t\tthis.<resourceVarName" + i + ">Repository = <resourceVarName" + i + ">Repository;\r\n";
			queries += "\tpublic List<init><resourceName" + i + "><end> all<resourceName" + i + ">s() {\r\n" + 
					"\t\treturn <resourceVarName" + i + ">Repository.getAll<resourceName" + i + ">s();\r\n" + 
					"\t}\r\n\n";
		}
		constructor = constructor.substring(0, constructor.length()-3);
		constructor += ") {\r\n";
		constructor2 += "\t}\r\n\n";
		result += variables + "\n" + constructor + constructor2 + queries + "}";
		return result;
	}

	public String getMutationTemplate(List<Resource> resources) {
		String result = "package com.servidorGraphQL.code;\r\n" + 
				"\r\n" + 
				"import com.coxautodev.graphql.tools.GraphQLRootResolver;\r\n" + 
				"\r\n" + 
				"public class Mutation implements GraphQLRootResolver {\r\n\n";
		String variables = "";
		String constructor = "\tpublic Mutation(";
		String constructor2 = "";
		String mutations = "";
		String arguments1 = null;
		String arguments2 = null;

		for(int i = 1; i < resources.size()+1; i++) {
			variables += "\tprivate final <resourceName" + i + ">Repository <resourceVarName" + i + ">Repository;\r\n";
			constructor += "<resourceName" + i + ">Repository <resourceVarName" + i + ">Repository,\r\n";
			constructor2 += "\t\tthis.<resourceVarName" + i + ">Repository = <resourceVarName" + i + ">Repository;\r\n";

			arguments1 = "(";
			arguments2 = "(";
			for(int j = 1; j < resources.get(i-1).getPredicates().size()+1; j++) {
				if(resources.get(i-1).getPredicates().get(j-1).getObject().getTemplate() == null) {
					if(resources.get(i-1).getPredicates().get(j-1).getObject().getRelation() == null) {
						arguments1 += "<datatype" + i+j + "> <predicateName" + i+j + ">, ";
						arguments2 += "<predicateName" + i+j + ">, ";
					}
					else {
						arguments1 += "String <childName" + i+j + ">, ";
						arguments2 += "<childName" + i+j + ">, ";
					}
				}
				else {
					arguments2 += "null, ";
				}
			}
			arguments1 = arguments1.substring(0, arguments1.length()-2);
			arguments1 += ") {\r\n";
			arguments2 = arguments2.substring(0, arguments2.length()-2);
			arguments2 += ");\r\n";
			mutations += "\tpublic <resourceName" + i + "> create<resourceName" + i + ">" + arguments1 +  
					"\t\t<resourceName" + i + "> new<resourceName" + i + "> = new <resourceName" + i + ">" + arguments2 + 
					"\t\treturn <resourceVarName" + i + ">Repository.save<resourceName" + i + ">(new<resourceName" + i + ">);\r\n" + 
					"\t}\r\n\n";
		}
		constructor = constructor.substring(0, constructor.length()-3);
		constructor += ") {\r\n";
		constructor2 += "\t}\r\n\n";
		result += variables + "\n" + constructor + constructor2 + mutations + "}";
		return result;
	}

	public String getResolverTemplate(Resource resource) {
		String result = "package com.servidorGraphQL.code;\r\n" + 
				"\r\n" + 
				"import com.coxautodev.graphql.tools.GraphQLResolver;\r\n" + 
				"\r\n" + 
				"public class <resourceName>Resolver implements GraphQLResolver<init><resourceName><end> {\r\n\n";
		String variables = "";
		String constructor = "\tpublic <resourceName>Resolver(";
		String constructor2 = "";
		String resolvers = "";

		for(int i = 1; i < resource.getPredicates().size()+1; i++) {
			if(resource.getPredicates().get(i-1).getObject().getRelation() != null) {
				variables += "\tprivate final <resourceNameRelation" + i + ">Repository <resourceVarNameRelation" + i + ">Repository;\r\n";
				constructor += "<resourceNameRelation" + i + ">Repository <resourceVarNameRelation" + i + ">Repository,\r\n";
				constructor2 += "\t\tthis.<resourceVarNameRelation" + i + ">Repository = <resourceVarNameRelation" + i + ">Repository;\r\n";

				resolvers += "\tpublic <resourceNameRelation" + i + "> <resourceVarNameRelation" + i + ">(<resourceName> <resourceVarName>) {\r\n" +
						"\t\treturn <resourceVarNameRelation" + i + ">Repository.findById(<resourceVarName>.get<childName" + i + ">());\r\n" + 
						"\t}\r\n\n";
			}
		}
		constructor = constructor.substring(0, constructor.length()-3);
		constructor += ") {\r\n";
		constructor2 += "\t}\r\n\n";
		result += variables + "\n" + constructor + constructor2 + resolvers + "}";
		return result;
	}

	public String getSchemaTemplate(List<Resource> resources) {
		String result = "schema {\n\tquery: Query\n\tmutation: Mutation\n}\n\n"
				+ "type Query {\n";

		for(int i = 1; i < resources.size()+1; i++) {
			result += "\tall<resourceName" + i + ">s: [<resourceName" + i + ">]\n";
		}
		result += "}\n\ntype Mutation {\n";

		for(int i = 1; i < resources.size()+1; i++) {
			result += "\tcreate<resourceName" + i + ">(";
			for(int j = 1; j < resources.get(i-1).getPredicates().size()+1; j++) {
				if(resources.get(i-1).getPredicates().get(j-1).getObject().getTemplate() == null) {
					if(resources.get(i-1).getPredicates().get(j-1).getObject().getRelation() == null) {
						result += "<predicateName" + i+j + ">: <datatype" + i+j + ">!, ";
					}
					else {
						result += "<childName" + i+j + ">: ID!, ";
					}
				}
			}
			result = result.substring(0, result.length()-2);
			result += "): <resourceName" + i + ">\n";
		}
		result += "}\n\n";

		for(int i = 1; i < resources.size()+1; i++) {
			result += "type <resourceName" + i + "> {\n\tid: ID!\n";
			for(int j = 1; j < resources.get(i-1).getPredicates().size()+1; j++) {
				result += "\t<predicateName" + i+j + ">: <datatype" + i+j + ">!\n";
			}
			result += "}\n\n";
		}
		return result;
	}

	public String getResourceClassTemplate(Resource resource) {
		return "package com.servidorGraphQL.code;\n\n\npublic class <resourceName> {\n\n" + 
				this.getAttributesResource(resource) + "\n" + this.getConstructorResource(resource) +
				this.getGettersResource(resource) + "}";
	}

	private String getAttributesResource(Resource resource) {
		String result = "\tprivate final String id;";
		for(int i = 1; i < resource.getPredicates().size()+1; i++) {
			if(resource.getPredicates().get(i-1).getObject().getRelation() == null) {
				result += "\n\tprivate final <datatype" + i + "> <predicateName" + i + ">;";
			}
			else {
				result += "\n\tprivate final String <childName" + i + ">;";
			}
		}
		return result + "\n";
	}

	private String getConstructorResource(Resource resource) {
		String constructor1 = "\tpublic <resourceName>(";
		String constructor2 = "\tpublic <resourceName>(String id, ";
		String constructor3 = "\t\tthis(null, ";
		String constructor4 = "\n\t\tthis.id = id;";
		for(int i = 1; i < resource.getPredicates().size()+1; i++) {
			if(resource.getPredicates().get(i-1).getObject().getRelation() == null) {
				constructor1 += "<datatype" + i + "> <predicateName" + i + ">, ";
				constructor2 += "<datatype" + i + "> <predicateName" + i + ">, ";
				constructor3 += "<predicateName" + i + ">, ";
				constructor4 += "\n\t\tthis.<predicateName" + i + "> = <predicateName" + i + ">;";
			}
			else {
				constructor1 += "String <childName" + i + ">, ";
				constructor2 += "String <childName" + i + ">, ";
				constructor3 += "<childName" + i + ">, ";
				constructor4 += "\n\t\tthis.<childName" + i + "> = <childName" + i + ">;";
			}
		}
		constructor1 = constructor1.substring(0, constructor1.length()-2);
		constructor1 += ") {\n";
		constructor2 = constructor2.substring(0, constructor2.length()-2);
		constructor2 += ") {";
		constructor3 = constructor3.substring(0, constructor3.length()-2);
		constructor3 += ");";
		return constructor1 + constructor3 + "\n\t}\n\n" + constructor2 + constructor4 + "\n\t}\n";
	}

	private String getGettersResource(Resource resource) {
		String getters = "\n\tpublic String getId() {\r\n" + 
				"\t\treturn id;\r\n" + 
				"\t}";
		for(int i = 1; i < resource.getPredicates().size()+1; i++) {
			if(resource.getPredicates().get(i-1).getObject().getRelation() == null) {
				getters += "\n\tpublic <datatype" + i + "> get<predicateGetterName" + i + ">() {\n\t\treturn <predicateName" + i + ">;\n\t}\n";
			}
			else {
				getters += "\n\tpublic String get<childGetterName" + i + ">() {\n\t\treturn <childName" + i + ">;\n\t}\n";
			}
		}
		return getters;
	}

	public String getResourceRepositoryTemplate(Resource resource) {
		return "package com.servidorGraphQL.code;\n\n" +
				this.getRepositoryImports() +
				"\n\n" +
				"public class <resourceName>Repository {\r\n" + 
				"\r\n" + 
				"\tprivate final MongoCollection<init>Document<end> <resourceVarName>s;\r\n" + 
				"\r\n" + 
				"\tpublic <resourceName>Repository(MongoCollection<init>Document<end> <resourceVarName>s) {\r\n" + 
				"\t\tthis.<resourceVarName>s = <resourceVarName>s;\r\n" + 
				"\t}\r\n\n" +
				this.getRepositoryFind() + "\n\n" + this.getRepositoryGetAll() + 
				"\n\n" + this.getRepositorySaveAndConstructorResource(resource) + "}";
	}

	private String getEndpointImports() {
		return "import com.coxautodev.graphql.tools.SchemaParser;\r\n" + 
				"import com.mongodb.MongoClient;\r\n" + 
				"import com.mongodb.client.MongoDatabase;\r\n" + 
				"\r\n" + 
				"import java.util.List;\r\n" + 
				"import java.util.Optional;\r\n" + 
				"import java.util.stream.Collectors;\r\n" + 
				"\r\n" + 
				"import javax.servlet.annotation.WebServlet;\r\n" + 
				"import javax.servlet.http.HttpServletRequest;\r\n" + 
				"import javax.servlet.http.HttpServletResponse;\r\n" + 
				"\r\n" + 
				"import graphql.ExceptionWhileDataFetching;\r\n" + 
				"import graphql.GraphQLError;\r\n" + 
				"import graphql.schema.GraphQLSchema;\r\n" + 
				"import graphql.servlet.GraphQLContext;\r\n" + 
				"import graphql.servlet.SimpleGraphQLServlet;";
	}

	private String getEndpointErrors() {
		return "@Override\r\n" + 
				"\tprotected List<init>GraphQLError<end> filterGraphQLErrors(List<init>GraphQLError<end> errors) {\r\n" + 
				"\t\treturn errors.stream()\r\n" + 
				"\t\t\t.filter(e -> e instanceof ExceptionWhileDataFetching || super.isClientError(e))\r\n" + 
				"\t\t\t.map(e -> e instanceof ExceptionWhileDataFetching ? new SanitizedError((ExceptionWhileDataFetching) e) : e)\r\n" + 
				"\t\t\t.collect(Collectors.toList());\r\n" + 
				"\t}\r\n\n";
	}

	private String getRepositoryImports() {
		return "import com.mongodb.client.FindIterable;\r\n" + 
				"import com.mongodb.client.MongoCollection;\r\n" + 
				"\r\n" + 
				"import org.bson.Document;\r\n" + 
				"import org.bson.conversions.Bson;\r\n" + 
				"import org.bson.types.ObjectId;\r\n" + 
				"\r\n" + 
				"import java.util.ArrayList;\r\n" + 
				"import java.util.List;\r\n" + 
				"import java.util.Optional;\r\n" + 
				"\r\n" + 
				"import static com.mongodb.client.model.Filters.and;\r\n" + 
				"import static com.mongodb.client.model.Filters.eq;\r\n" + 
				"import static com.mongodb.client.model.Filters.regex;";
	}

	private String getRepositoryFind() {
		return "\tpublic <resourceName> findById(String id) {\r\n" + 
				"\tDocument doc = <resourceVarName>s.find(eq(\"_id\", new ObjectId(id))).first();\r\n" + 
				"\treturn <resourceVarName>(doc);\r\n" + 
				"\t}";
	}

	private String getRepositoryGetAll() {
		return "\tpublic List<init><resourceName><end> getAll<resourceName>s() {\r\n" + 
				"\t\tList<init><resourceName><end> all<resourceName>s = new ArrayList<init><resourceName><end>();\r\n" + 
				"\t\tfor (Document doc : <resourceVarName>s.find()) {\r\n" + 
				"\t\t\tall<resourceName>s.add(<resourceVarName>(doc));\r\n" + 
				"\t\t}\r\n" + 
				"\t\treturn all<resourceName>s;\r\n" + 
				"\t}";
	} 

	/* private String getRepositoryGetAll() {
		return "\tpublic List<<resourceName>> getAll<resourceName>s(<resourceName>Filter filter, int skip, int first) {\r\n" + 
				"\t\tOptional<Bson> mongoFilter = Optional.ofNullable(filter).map(this::buildFilter);\r\n" + 
				"\r\n" + 
				"\t\tList<<resourceName>> all<resourceName>s = new ArrayList<>();\r\n" + 
				"\t\tFindIterable<Document> documents = mongoFilter.map(<resourceVarName>s::find).orElseGet(<resourceVarName>s::find);\r\n" + 
				"\t\tfor (Document doc : documents.skip(skip).limit(first)) {\r\n" + 
				"\t\t\tall<resourceName>.add(<resourceVarName>(doc));\r\n" + 
				"\t\t}\r\n" + 
				"\t\treturn all<resourceName>s;\r\n" + 
				"\t}";
	} */

	private String getRepositorySaveAndConstructorResource(Resource resource) {
		String save = "\tpublic <resourceName> save<resourceName>(<resourceName> <resourceVarName>) {\r\n" + 
				"\t\tDocument doc = new Document();\r\n"; 
		String constructor = "\tprivate <resourceName> <resourceVarName>(Document doc) {\r\n";
		String constructor2	= "\t\treturn new <resourceName>(\r\n" + 
				"\t\t\tdoc.get(\"_id\").toString(),\r\n";

		for(int i = 1; i < resource.getPredicates().size()+1; i++) {
			if(resource.getPredicates().get(i-1).getObject().getTemplate() == null) {
				if(resource.getPredicates().get(i-1).getObject().getRelation() == null) {
					save += "\t\tdoc.append(\"<referenceName" + i + ">\", <resourceVarName>.get<predicateGetterName" + i + ">());\r\n";
					constructor2 += "\t\t\tdoc.get<datatypeGetterName" + i + ">(\"<referenceName" + i + ">\"),\r\n";
				}
				else {
					save += "\t\tdoc.append(\"<childName" + i + ">\", <resourceVarName>.get<childGetterName" + i + ">());\r\n";
					constructor2 += "\t\t\tdoc.getString(\"<childName" + i + ">\"),\r\n";
				}
			}
			else {
				constructor2 += "\t\t\t\"" + getTemplateString(resource, resource.getPredicates().get(i-1)) + "\",\r\n";
			}
		}
		constructor2 = constructor2.substring(0, constructor2.length()-3);
		constructor2 += ");\r\n";
		save += "\t\t<resourceVarName>s.insertOne(doc);\r\n" + 
				constructor2 +
				"\t}\r\n";
		constructor += constructor2 + 
				"\t}\r\n";
		return save + "\n" + constructor;
	}

	private String getTemplateString(Resource resource, Predicate predicate) {
		String template = predicate.getObject().getTemplate();
		for(int i = 1; i < resource.getPredicates().size()+1; i++) {
			if(resource.getPredicates().get(i-1).getObject().getReference() != null && template.contains(resource.getPredicates().get(i-1).getObject().getReference())) {
				template = template.replaceAll(resource.getPredicates().get(i-1).getObject().getReference(), "\" + doc.getString(\"<referenceName" + i + ">\") + \"");
			}
		}

		return template;
	}
}
