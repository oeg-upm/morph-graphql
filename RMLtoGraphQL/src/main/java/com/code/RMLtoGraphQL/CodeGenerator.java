package com.code.RMLtoGraphQL;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import org.stringtemplate.v4.ST;

public class CodeGenerator  {
	private Templates templates;

	public CodeGenerator(Templates templates) {
		this.templates = templates;
	}	

	public void generateCode(String routeCreate, RMLFile rmlFile) {
		String routeQueryClass = routeCreate + "\\Query.java";
		String routeMutationClass = routeCreate + "\\Mutation.java";
		String routeEndpointClass = routeCreate + "\\GraphQLEndpoint.java";
		File fileQueryClass = new File(routeQueryClass);
		File fileMutationClass = new File(routeMutationClass);
		File fileEndpointClass = new File(routeEndpointClass);

		generateQueryClass(fileQueryClass, rmlFile.getResources());
		generateMutationClass(fileMutationClass, rmlFile.getResources());
		generateEndpointClass(fileEndpointClass, rmlFile);
		generateResourcesCode(routeCreate, rmlFile.getResources());
	}

	private void generateResourcesCode(String routeCreate, List<Resource> resources) {
		for(int i = 0; i < resources.size(); i++) {
			String routeFileClass = routeCreate + "\\" + resources.get(i).getNameClass() + ".java";
			String routeFileRepository = routeCreate + "\\" + resources.get(i).getNameClass() + "Repository.java";
			File fileClass = new File(routeFileClass);
			File fileRepository = new File(routeFileRepository);
			generateResourceClass(fileClass, resources.get(i));
			generateResourceRepository(fileRepository, resources.get(i));

			if(resources.get(i).isHaveRelation()) {
				String routeFileResolver = routeCreate + "\\" + resources.get(i).getNameClass() + "Resolver.java";
				File fileResolver = new File(routeFileResolver);
				generateResolverClass(fileResolver, resources.get(i));
			}
		}
	}

	private void generateEndpointClass(File file, RMLFile rmlFile) {
		BufferedWriter bw = null;

		try {
			bw = new BufferedWriter(new FileWriter(file));
			ST endpointTemplate = new ST(templates.getEndpointTemplate(rmlFile.getResources()));
			endpointTemplate.add("init", "<");
			endpointTemplate.add("end", ">");
			endpointTemplate.add("sourceName", rmlFile.getSource());
			for(int i = 1; i < rmlFile.getResources().size()+1; i++) {
				if(rmlFile.getResources().get(i-1).isHaveRelation()) {
					for(int j = 1; j < rmlFile.getResources().get(i-1).getPredicates().size()+1; j++) {
						if(rmlFile.getResources().get(i-1).getPredicates().get(j-1).getObject().getRelation() != null) {
							endpointTemplate.add("resourceVarNameRelation" + i+j, rmlFile.getResources().get(i-1).getPredicates().get(j-1).getObject().getRelation().toLowerCase());
						}
					}
				}
				endpointTemplate.add("resourceName" + i, rmlFile.getResources().get(i-1).getNameClass());
				endpointTemplate.add("resourceVarName" + i, rmlFile.getResources().get(i-1).getNameClass().toLowerCase());
				endpointTemplate.add("iteratorName" + i, rmlFile.getResources().get(i-1).getIterator());
			}
			String endpointString = endpointTemplate.render();
			bw.write(endpointString);
			bw.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void generateQueryClass(File file, List<Resource> resources) {
		BufferedWriter bw = null;

		try {
			bw = new BufferedWriter(new FileWriter(file));
			ST queryTemplate = new ST(templates.getQueryTemplate(resources));
			queryTemplate.add("init", "<");
			queryTemplate.add("end", ">");
			for(int i = 1; i < resources.size()+1; i++) {
				queryTemplate.add("resourceName" + i, resources.get(i-1).getNameClass());
				queryTemplate.add("resourceVarName" + i, resources.get(i-1).getNameClass().toLowerCase());

			}
			String queryString = queryTemplate.render();
			bw.write(queryString);
			bw.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void generateMutationClass(File file, List<Resource> resources) {
		BufferedWriter bw = null;

		try {
			bw = new BufferedWriter(new FileWriter(file));
			ST mutationTemplate = new ST(templates.getMutationTemplate(resources));
			for(int i = 1; i < resources.size()+1; i++) {
				mutationTemplate.add("resourceName" + i, resources.get(i-1).getNameClass());
				mutationTemplate.add("resourceVarName" + i, resources.get(i-1).getNameClass().toLowerCase());
				for(int j = 1; j < resources.get(i-1).getPredicates().size()+1; j++) {
					if(resources.get(i-1).getPredicates().get(j-1).getObject().getRelation() == null) {
						mutationTemplate.add("predicateName" + i+j, resources.get(i-1).getPredicates().get(j-1).getPredicate());
						mutationTemplate.add("datatype" + i+j, resources.get(i-1).getPredicates().get(j-1).getObject().getDatatype());
					}
					else {
						mutationTemplate.add("predicateName" + i+j, resources.get(i-1).getPredicates().get(j-1).getPredicate());
						mutationTemplate.add("datatype" + i+j, resources.get(i-1).getPredicates().get(j-1).getObject().getRelation());
						mutationTemplate.add("childName" + i+j, resources.get(i-1).getPredicates().get(j-1).getObject().getChild());
					}
				}
			}
			String mutationString = mutationTemplate.render();
			bw.write(mutationString);
			bw.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void generateResourceClass(File file, Resource resource) {
		BufferedWriter bw = null;

		try {
			bw = new BufferedWriter(new FileWriter(file));
			ST fileClassTemplate = new ST(templates.getResourceClassTemplate(resource));
			fileClassTemplate.add("resourceName", resource.getNameClass());
			for(int i = 1; i < resource.getPredicates().size()+1; i++) {
				if(resource.getPredicates().get(i-1).getObject().getRelation() == null) {
					fileClassTemplate.add("predicateName" + i, resource.getPredicates().get(i-1).getPredicate());
					fileClassTemplate.add("predicateGetterName" + i, Character.toUpperCase(resource.getPredicates().get(i-1).getPredicate().charAt(0)) + 
							resource.getPredicates().get(i-1).getPredicate().substring(1,resource.getPredicates().get(i-1).getPredicate().length()));
					fileClassTemplate.add("datatype" + i, resource.getPredicates().get(i-1).getObject().getDatatype());
				}
				else {
					fileClassTemplate.add("predicateName" + i, resource.getPredicates().get(i-1).getPredicate());
					fileClassTemplate.add("predicateGetterName" + i, Character.toUpperCase(resource.getPredicates().get(i-1).getPredicate().charAt(0)) + 
							resource.getPredicates().get(i-1).getPredicate().substring(1,resource.getPredicates().get(i-1).getPredicate().length()));
					fileClassTemplate.add("datatype" + i, resource.getPredicates().get(i-1).getObject().getDatatype());
					fileClassTemplate.add("childName" + i, resource.getPredicates().get(i-1).getObject().getChild());
					fileClassTemplate.add("childGetterName" + i, Character.toUpperCase(resource.getPredicates().get(i-1).getObject().getChild().charAt(0)) + 
							resource.getPredicates().get(i-1).getObject().getChild().substring(1,resource.getPredicates().get(i-1).getObject().getChild().length()));
				}
			}
			String fileClassString = fileClassTemplate.render();
			bw.write(fileClassString);
			bw.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void generateResolverClass(File file, Resource resource) {
		BufferedWriter bw = null;

		try {
			bw = new BufferedWriter(new FileWriter(file));
			ST fileResolverTemplate = new ST(templates.getResolverTemplate(resource));
			fileResolverTemplate.add("resourceName", resource.getNameClass());
			fileResolverTemplate.add("resourceVarName", resource.getNameClass().toLowerCase());
			fileResolverTemplate.add("init", "<");
			fileResolverTemplate.add("end", ">");
			for(int i = 1; i < resource.getPredicates().size()+1; i++) {
				if(resource.getPredicates().get(i-1).getObject().getRelation() != null) {
					fileResolverTemplate.add("resourceNameRelation" + i, resource.getPredicates().get(i-1).getObject().getRelation());
					fileResolverTemplate.add("resourceVarNameRelation" + i, resource.getPredicates().get(i-1).getObject().getRelation().toLowerCase());
					fileResolverTemplate.add("childName" + i, Character.toUpperCase(resource.getPredicates().get(i-1).getObject().getChild().charAt(0)) + 
							resource.getPredicates().get(i-1).getObject().getChild().substring(1,resource.getPredicates().get(i-1).getObject().getChild().length()));
				}
			}
			String fileResolverString = fileResolverTemplate.render();
			bw.write(fileResolverString);
			bw.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void generateResourceRepository(File file, Resource resource) {
		BufferedWriter bw = null;

		try {
			bw = new BufferedWriter(new FileWriter(file));
			ST fileRepositoryTemplate = new ST(templates.getResourceRepositoryTemplate(resource));
			fileRepositoryTemplate.add("resourceName", resource.getNameClass());
			fileRepositoryTemplate.add("resourceVarName", resource.getNameClass().toLowerCase());
			fileRepositoryTemplate.add("init", "<");
			fileRepositoryTemplate.add("end", ">");
			for(int i = 1; i < resource.getPredicates().size()+1; i++) {
				if(resource.getPredicates().get(i-1).getObject().getRelation() == null) {
					fileRepositoryTemplate.add("referenceName" + i, resource.getPredicates().get(i-1).getObject().getReference());
					fileRepositoryTemplate.add("datatypeGetterName" + i, Character.toUpperCase(resource.getPredicates().get(i-1).getObject().getDatatype().charAt(0)) + 
							resource.getPredicates().get(i-1).getObject().getDatatype().substring(1,resource.getPredicates().get(i-1).getObject().getDatatype().length()));
					fileRepositoryTemplate.add("predicateGetterName" + i, Character.toUpperCase(resource.getPredicates().get(i-1).getPredicate().charAt(0)) + 
							resource.getPredicates().get(i-1).getPredicate().substring(1,resource.getPredicates().get(i-1).getPredicate().length()));
				}
				else {
					fileRepositoryTemplate.add("resourceNameRelation" + i, resource.getPredicates().get(i-1).getObject().getRelation());
					fileRepositoryTemplate.add("resourceVarNameRelation" + i, resource.getPredicates().get(i-1).getObject().getRelation().toLowerCase());
					fileRepositoryTemplate.add("childName" + i, resource.getPredicates().get(i-1).getObject().getChild());
					fileRepositoryTemplate.add("childGetterName" + i, Character.toUpperCase(resource.getPredicates().get(i-1).getObject().getChild().charAt(0)) + 
							resource.getPredicates().get(i-1).getObject().getChild().substring(1,resource.getPredicates().get(i-1).getObject().getChild().length()));
				}
			} 
			String fileRepositoryString = fileRepositoryTemplate.render();
			bw.write(fileRepositoryString);
			bw.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}