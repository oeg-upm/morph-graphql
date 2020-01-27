package com.code.RMLtoGraphQL;

public class Predicate  {
	private String predicate;
	private ObjectMap object;
	public Predicate(String predicate, ObjectMap object) {
		this.predicate = predicate;
		this.object = object;
	}
	public String getPredicate() {
		return predicate;
	}
	public void setPredicate(String predicate) {
		this.predicate = predicate;
	}
	public ObjectMap getObject() {
		return object;
	}
	public void setObject(ObjectMap object) {
		this.object = object;
	}
	
	@Override
	public String toString() {
		return predicate + ", \n" + object + "]";
	}
	
	
}

