package com.code.RMLtoGraphQL;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

public class ProjectGenerator {
	private String routeCreate;
	private String routeServer;
	private RMLFile rmlFile;
	private Templates templates;
	private static SchemaGenerator schemaGenerator;
	private static CodeGenerator codeGenerator;

	public ProjectGenerator(String routeServer, String routeCreate, RMLFile rmlFile, Templates templates) {
		this.routeCreate = routeCreate + "\\ServidorGraphQL";
		this.routeServer = routeServer;
		this.rmlFile = rmlFile;
		this.templates = templates;
		
		
		schemaGenerator = new SchemaGenerator(this.templates);
		codeGenerator = new CodeGenerator(this.templates);
	}

	public void generateProject() {
		System.out.println(routeCreate);
		System.out.println(routeServer);
		
		deleteDirectory(new File(routeCreate));
		copyDirectory(new File(routeServer), new File(routeCreate));
		
		String routeSchema = routeCreate + "\\src\\main\\resources";
		schemaGenerator.generateSchema(routeSchema, rmlFile.getResources());
		
		String routeCode = routeCreate + "\\src\\main\\java\\com\\servidorGraphQL\\code";
		codeGenerator.generateCode(routeCode, rmlFile);
	}

	private static void copyDirectory(File d1, File d2) {
		if(d1.isDirectory()) {
			if (!d2.exists()){                              
				d2.mkdir();
			}
			String[] files = d1.list();
			for (int i = 0; i < files.length; i++) {
			  copyDirectory(new File(d1, files[i]), new File(d2, files[i]));                           
			}
		}
		else {
			copyFile(d1, d2);
		}
	}

	private static void copyFile(File f1, File f2) {
		try {
			InputStream in = new FileInputStream(f1);
			OutputStream out = new FileOutputStream(f2);

			byte[] buffer = new byte[1024];
			int len;

			while ((len = in.read(buffer)) > 0) {
				out.write(buffer, 0, len);
			}

			in.close();
			out.close();

		} catch (IOException ioe){
			ioe.printStackTrace();
		}
	}
	
	public static void deleteDirectory(File d1) {
		File[] files = d1.listFiles();
		 
		 for (int i = 0; i < files.length; i++) {
			 if (files[i].isDirectory()) {
				  deleteDirectory(files[i]);
				}
				files[i].delete();
		 }
	}
}
