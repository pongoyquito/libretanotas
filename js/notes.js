
//====[Bloque Funciones: definicion]========================
//
//--- Objeto array
//--- "notas": [{"titulo": "Comprar pan", "contenido": "Oferta en la panaderia de la esquina"}]

var app = {

	model: {
		"notas": []
	},

	inicio: function(){
		this.iniciaFastClick();
		this.iniciaBotones();
		this.refrescarLista();
	},

	iniciaFastClick: function() {
		FastClick.attach(document.body);
	},

	iniciaBotones: function() {
		var salvar = document.querySelector('#salvar');
		var anadir = document.querySelector('#anadir');
		var limpiar = document.querySelector('#limpiar');
	
		anadir.addEventListener('click' ,this.mostrarEditor, false);
		salvar.addEventListener('click' ,this.salvarNota, false);
		limpiar.addEventListener('click' ,this.limpiarFichero, false);
	},

	limpiarFichero: function() {
		app.borrarFichero();
		app.model.notas = [];
		app.inicio();
	},
	
	mostrarEditor: function() {
		// alert('pulsado boton');
		document.getElementById('titulo').value = "";
		document.getElementById('comentario').value = "";
		document.getElementById("note-editor").style.display = "block";
		document.getElementById('titulo').focus();
	},

	salvarNota: function() {
		app.construirNota();
		app.ocultarEditor();
		app.refrescarLista();
		app.grabarDatos();
	},

	refrescarLista: function() {
		var div=document.getElementById('notes-list');
		div.innerHTML = this.anadirNotasALista();
	},

	anadirNotasALista: function() {
		var notas = this.model.notas;
		var notasDivs = '';
		for (var i in notas) {
			var titulo = notas[i].titulo + "<br>" + notas[i].contenido;
			notasDivs = notasDivs + this.anadirNota(i, titulo);
		}
		return notasDivs;
	},

	anadirNota: function(id, titulo) {
		return "<div class='note-item' id='notas[" + id + "]'>" + titulo + "</div>";
	},

	//-----------------------------------------------------
	
	//------- Bloque: ESCRIBIR DATOS -------
	
	grabarDatos: function() {
		window.resolveLocalFileSystemURL( cordova.file.dataDirectory, this.gotFS, this.fail);
	},
	
	gotFS: function(fileSystem) {
		//-- dirEntry.getFile
        fileSystem.getFile("mifichero.txt", {create: true, exclusive: false}, app.gotFileEntry, app.fail);
    },
	
    gotFileEntry: function(fileEntry) {
        fileEntry.createWriter(app.gotFileWriter, app.fail);
    },
	
	gotFileWriter: function(writer) {
		
		writer.onwriteend = function(evt) {
			console.log(" *** datos grabados ***");
		};

		var notas = app.model.notas;
		var todito = "";
		for (var i in notas) {
			var titulo = notas[i].titulo + "|" + notas[i].contenido;
			todito = todito + titulo + "@";
		}
		console.log(todito);
		
		//writer.write(JSON.stringify(app.model));
		writer.write(todito);
	},

	//------- Bloque: LEER DATOS -------
	
	leerDatos: function() {
		window.resolveLocalFileSystemURL( cordova.file.dataDirectory, this.obtenerFS, this.fail);
	},

	obtenerFS: function(dirEntry) {
		console.log('**(D)*** ' + dirEntry.name);
        dirEntry.getFile("mifichero.txt", {create:false}, app.obtenerFileEntry, app.inicio());
    },
	
    obtenerFileEntry: function(fileEntry) {
		console.log('**(F)*** ' + fileEntry.name);
        fileEntry.file(app.leerFile, app.fail);
    },

    leerFile: function(file) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			var data = evt.target.result;
			
			//if ( data != null ) {
				var lectura = data.split("@");

				var notas = app.model.notas;
				for (var i in lectura) {
					var titulo = lectura[i];
					if (titulo.length > 0) {
						fistro = titulo.split("|");
						notas.push({"titulo": fistro[0] , "contenido": fistro[1] });
					};
				};
			//};
            /*
			app.model = JSON.parse(data);
			*/
			app.inicio();
        };
        reader.readAsText(file);
    },

	
	//------- Bloque: BORRAR FICHERO -------
			
	
	borrarFichero: function() {
		window.resolveLocalFileSystemURL( cordova.file.dataDirectory, this.borrarFS, this.fail);
	},

	borrarFS: function(dirEntry) {
        dirEntry.getFile("mifichero.txt", {create:false}, app.borrarFileEntry, app.fail);
    },
	
    borrarFileEntry: function(fileEntry) {
		console.log('**(F)*** ' + fileEntry.name);
        fileEntry.remove( function(){console.log('Fichero borrado.')}, app.fail);
    },
	
	//------- Bloque: ERROR DATOS -------
			
	fail: function(error) {
		console.log(error.code);
	},
	
	//-----------------------------------------------------
	
	construirNota: function() {
		var notas = app.model.notas;
		notas.push({"titulo": app.extraerTitulo() , "contenido": app.extraerComentario() });
	},

	extraerTitulo: function() {
		return document.getElementById('titulo').value;
	},

	extraerComentario: function() {
		return document.getElementById('comentario').value;
	},

	ocultarEditor: function() {
		document.getElementById("note-editor").style.display = "none";
	}
};

//====[Bloque Principal: Arranque]========================

if('addEventListener' in document){
	  document.addEventListener('deviceready', function() {
		    //app.inicio();
			app.leerDatos();
	}, false);
};
