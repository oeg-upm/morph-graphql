package com.code.RMLtoGraphQL;

public class ObjectMap {
	private String relation;
	private String child;
	private String parent;
	private String reference;
	private String datatype;
	private String template;
	
	public ObjectMap() {
		super();
	}
	
	public ObjectMap(String relation, String child, String parent, String reference, String datatype, String template) {
		this.relation = relation;
		this.child = child;
		this.parent = parent;
		this.reference = reference;
		this.datatype = datatype;
		this.template = template;
	}
	
	public String getReference() {
		return reference;
	}
	public void setReference(String reference) {
		this.reference = reference;
	}
	public String getDatatype() {
		return datatype;
	}
	public void setDatatype(String datatype) {
		this.datatype = datatype;
	}
	
	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	public String getRelation() {
		return relation;
	}

	public void setRelation(String relation) {
		this.relation = relation;
	}

	public String getChild() {
		return child;
	}

	public void setChild(String child) {
		this.child = child;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	@Override
	public String toString() {
		return "ObjectMap\n[relation=" + relation + ", \nreference=" + reference + ", \ndatatype=" + datatype + ", \ntemplate=" + template + "]";
	}
	
	
}
