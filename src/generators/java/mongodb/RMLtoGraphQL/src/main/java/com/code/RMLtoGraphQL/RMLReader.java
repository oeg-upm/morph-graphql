package com.code.RMLtoGraphQL;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resources;
import javax.swing.JOptionPane;

public class RMLReader {
	private static final String nameClass = "rr:class ";
	private static final String predicateObjectMap = "rr:predicateObjectMap";
	private static final String predicate = "rr:predicate ";
	private static final String objectMap = "rr:objectMap";
	private static final String reference = "rml:reference ";
	private static final String datatype = "rr:datatype ";
	private static final String source = "rml:source ";
	private static final String iterator = "rml:iterator ";
	private static final String template = "rr:template ";
	private static final String subjectMap = "rr:subjectMap ";
	private static final String parentTriplesMap = "rr:parentTriplesMap ";
	private static final String joinConditionChild = "rr:child ";
	private static final String joinConditionParent = "rr:parent ";

	public RMLReader() {
		super();
	}

	public RMLFile read(File mapping) {
		List<Resource> resources = new ArrayList<Resource>();
		FileReader fr = null;
		try {
			fr = new FileReader(mapping);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		BufferedReader br = new BufferedReader(fr);
		List<Predicate> predicates = new ArrayList<Predicate>();
		String line, nameClassString = null,  predicateString = null, referenceString = null, datatypeString = null, 
				sourceString = null, iteratorString = null, templateString = null, parentTriplesMapString = null, templateMainString = null, 
				triplesMapNameString = null, joinConditionChildString = null, joinConditionParentString = null;
		boolean haveRelation = false;
		Resource resource;
		try {
			while((line = br.readLine()) != null) {
				if(!line.contains("@") && line.contains("<")) {
					triplesMapNameString = getTriplesMapName(line);
					while(!(line = br.readLine()).contains("].")) {
						if(line.contains(source)) {
							sourceString = getParameter(line, source);
						}
						else if(line.contains(iterator)) {
							iteratorString = getParameterIterator(line, iterator);
						}
						else if(line.contains(nameClass)) {
							nameClassString = getParameter(line, nameClass);
						}
						else if(line.contains(predicate)) {
							predicateString = getParameter(line, predicate);
							predicates.add(new Predicate(predicateString, new ObjectMap()));
						}
						else if(line.contains(parentTriplesMap)) {
							parentTriplesMapString = getParameterParentTriplesMap(line, parentTriplesMap);
							predicates.get(predicates.size()-1).getObject().setRelation(parentTriplesMapString);
							haveRelation = true;
						}
						else if(line.contains(template)) {
							if(predicates.size() == 0) {
								// templateMainString = getParameter(line, template);
							}
							else {
								templateString = getParameter(line, template);
								predicates.get(predicates.size()-1).getObject().setTemplate(templateString);;
							}
						}
						else if(line.contains(reference)) {
							referenceString = getParameter(line, reference);
							predicates.get(predicates.size()-1).getObject().setReference(referenceString);
						}
						else if(line.contains(datatype)) {
							datatypeString = getParameter(line, datatype);
							predicates.get(predicates.size()-1).getObject().setDatatype(datatypeString);
						}
						else if(line.contains(joinConditionChild)) {
							joinConditionChildString = getParameter(line, joinConditionChild);
							predicates.get(predicates.size()-1).getObject().setChild(joinConditionChildString);;
						}
						else if(line.contains(joinConditionParent)) {
							joinConditionParentString = getParameter(line, joinConditionParent);
							predicates.get(predicates.size()-1).getObject().setParent(joinConditionParentString);;
						}
					}

					if(sourceString == null) {
						JOptionPane.showMessageDialog(null, "No se ha encontrado definido el atributo rr:source en el fichero mapping", "ERROR CON EL FICHERO MAPPING", JOptionPane.ERROR_MESSAGE);
						return null;
					}
					else if(nameClassString == null) {
						JOptionPane.showMessageDialog(null, "No se ha encontrado definido el atributo rr:class en el fichero mapping", "ERROR CON EL FICHERO MAPPING", JOptionPane.ERROR_MESSAGE);
						return null;
					}
					else if (iteratorString == null) {
						JOptionPane.showMessageDialog(null, "No se ha encontrado definido el atributo rml:iterator en el fichero mapping", "ERROR CON EL FICHERO MAPPING", JOptionPane.ERROR_MESSAGE);
						return null;
					}

					for(int i = 0; i < predicates.size(); i++) {
						if(predicates.get(i).getObject().getRelation() != null) {
							predicates.get(i).getObject().setDatatype(predicates.get(i).getObject().getRelation());
						}
						if(predicates.get(i).getObject().getDatatype() == null) {
							predicates.get(i).getObject().setDatatype("String");
						}
					}

					resource = new Resource(triplesMapNameString, nameClassString, templateMainString, iteratorString, predicates, haveRelation);
					resources.add(resource);
					predicates = new ArrayList<Predicate>();
					nameClassString = null;
					predicateString = null;
					referenceString = null;
					datatypeString = null;
					iteratorString = null;
					templateString = null;
					parentTriplesMapString = null;
					triplesMapNameString = null;
					joinConditionChildString = null;
					joinConditionParentString = null;
					templateMainString = null;
					haveRelation = false;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		seeResources(resources);
		resources = triplesMapToClass(resources);
		System.out.println(sourceString);
		seeResources(resources);
		return new RMLFile(resources, sourceString);
	} 

	private String getParameter(String line, String typeParameter) {
		line = line.trim();
		line = line.replace("\t", "");
		int index = line.indexOf(typeParameter);
		line = line.substring(index);
		index = line.indexOf(" ") + 1;
		line = line.substring(index);
		if(line.charAt(line.length()-1) == ';' || line.charAt(line.length()-1) == ','
				|| line.charAt(line.length()-1) == ']') {
			line = line.substring(0, line.length()-1);
		}
		if(line.charAt(0) == '"') {
			line = line.substring(1, line.length()-1);
		}
		line = line.substring(line.indexOf(":") + 1);
		// line = line.replace(":", "");
		return line;
	}

	private String getParameterIterator(String line, String typeParameter) {
		line = line.trim();
		line = line.replace("\t", "");
		int index = line.indexOf(typeParameter);
		line = line.substring(index);
		index = line.indexOf(" ") + 1;
		line = line.substring(index);
		if(line.charAt(line.length()-1) == ';' || line.charAt(line.length()-1) == ','
				|| line.charAt(line.length()-1) == ']') {
			line = line.substring(0, line.length()-1);
		}
		if(line.charAt(0) == '"') {
			line = line.substring(1, line.length()-1);
		}
		index = line.indexOf(".") + 1;
		int index2 = line.indexOf("[");
		line = line.substring(index, index2);
		return line;
	}
	
	private String getParameterParentTriplesMap(String line, String typeParameter) {
		line = line.trim();
		line = line.replace("\t", "");
		int index = line.indexOf(typeParameter);
		line = line.substring(index);
		index = line.indexOf(" ") + 1;
		line = line.substring(index);
		if(line.charAt(line.length()-1) == ';' || line.charAt(line.length()-1) == ','
				|| line.charAt(line.length()-1) == ']') {
			line = line.substring(0, line.length()-1);
		}
		
		line = line.substring(1, line.length()-1);
		return line;
	}
	
	private String getTriplesMapName(String line) {
		line = line.trim();
		line = line.replace("\t", "");
		int index1 = line.indexOf("<") + 1;
		int index2 = line.lastIndexOf(">");
		line = line.substring(index1, index2);
		return line;
	}
	
	private List<Resource> triplesMapToClass(List<Resource> resources) {
		for(int i = 0; i < resources.size(); i++) {
			if(resources.get(i).isHaveRelation()) {
				for(int j = 0; j < resources.get(i).getPredicates().size(); j++) {
					if(resources.get(i).getPredicates().get(j).getObject().getRelation() != null ) {
						for(int k = 0; k < resources.size(); k++) {
							if(resources.get(i).getPredicates().get(j).getObject().getRelation().equals(resources.get(k).getTriplesMapName())) {
								resources.get(i).getPredicates().get(j).getObject().setRelation(resources.get(k).getNameClass());
							}
						}
					}
				}
			}
		}
		
		return resources;
	}

	private void seeResources(List<Resource> resources) {
		for(int i = 0; i < resources.size(); i++) {
			System.out.println(resources.get(i));
		}
	}
}
