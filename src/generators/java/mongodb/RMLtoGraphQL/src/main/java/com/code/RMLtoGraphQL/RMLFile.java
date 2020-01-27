package com.code.RMLtoGraphQL;

import java.util.List;

public class RMLFile {
	private List<Resource> resources;
	private String source;
	
	public RMLFile(List<Resource> resources, String source) {
		this.resources = resources;
		this.source = source;
	}

	public List<Resource> getResources() {
		return resources;
	}

	public void setResources(List<Resource> resources) {
		this.resources = resources;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}
}
