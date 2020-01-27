package com.code.RMLtoGraphQL;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

public class Main {
	private static RMLFile rmlFile = null;
	private static Templates templates = new Templates();
	private static RMLReader reader = new RMLReader();
	private static ProjectGenerator projectGenerator;
	
	public static void main(String[] args) {
		File exampleDirectory = new File(getExampleDirectory()); 
		// muestra el cuadro de diálogo de archivos, para que el usuario pueda elegir el archivo a abrir
		boolean ficheroValido = false;
		File mapping = null;
		JOptionPane.showMessageDialog(null, "Seleccione su archivo mapping");
		JFileChooser selectorArchivos = new JFileChooser();
		selectorArchivos.setCurrentDirectory(exampleDirectory); 
		selectorArchivos.setFileSelectionMode(JFileChooser.FILES_ONLY);

		// indica cual fue la accion de usuario sobre el jfilechooser
		while(ficheroValido == false) {
			selectorArchivos.showOpenDialog(selectorArchivos);
			mapping = selectorArchivos.getSelectedFile(); // obtiene el archivo seleccionado

			// muestra error si es inválido
			if ((mapping == null) || (mapping.getName().equals(""))) {
				JOptionPane.showMessageDialog(selectorArchivos, "Se ha seleccionado un archivo no valido, o ha pulsado en Cancelar.", "Error", JOptionPane.ERROR_MESSAGE);
				if(JOptionPane.showConfirmDialog(null, "¿Desea buscar otro archivo?", "RMLtoGraphQL", JOptionPane.YES_NO_OPTION) == 1) {
					return;
				}
			}
			else 
				ficheroValido = true;
		}

		rmlFile = reader.read(mapping);
		if(rmlFile == null) {
			return;
		}

		File routeCreate = null;
		boolean directorioValido = false;
		JOptionPane.showMessageDialog(null, "Seleccione el directorio donde desee guardar su servidor GraphQL");
		selectorArchivos = new JFileChooser();
		selectorArchivos.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);

		// indica cual fue la accion de usuario sobre el jfilechooser
		while(directorioValido == false) {
			int result = selectorArchivos.showOpenDialog(selectorArchivos);
			routeCreate = selectorArchivos.getSelectedFile(); // obtiene el archivo seleccionado

			// muestra error si es inválido
			if ((routeCreate == null) || (routeCreate.getName().equals(""))) {
				JOptionPane.showMessageDialog(selectorArchivos, "Se ha seleccionado un directorio no valido, o ha pulsado en Cancelar.", "Error", JOptionPane.ERROR_MESSAGE);
				if(JOptionPane.showConfirmDialog(null, "¿Desea establecer otro directorio?", "RMLtoGraphQL", JOptionPane.YES_NO_OPTION) == 1) {
					return;
				}
			}
			else 
				directorioValido = true;
		}
		projectGenerator = new ProjectGenerator(getServerDirectory(), routeCreate.getAbsolutePath(), rmlFile, templates);
		projectGenerator.generateProject();
	}

	private static String getExampleDirectory() {
		String path = new File("").getAbsolutePath();
		path = fixRoute(path);
		int index = path.lastIndexOf("\\");
		path = path.substring(0, index) + "\\Ejemplos";
		return path;
	}
	
	private static String getServerDirectory() {
		String path = new File("").getAbsolutePath();
		path = fixRoute(path);
		return path + "\\serverData";
	}
	
	private static String fixRoute(String route) {
		if(!route.contains("src")) {
			return route + "\\src";
		}
		else
			return route;
	}
}
