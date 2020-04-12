import { Component } from '@angular/core';
import { LexicoAnalizer } from '../app/analizer/LexicoAnalizer';
import { SintacticoAnalizer } from './analizer/SintacticoAnalizer';
import { TokenController } from './controller/TokenController';
import { TraductorController } from './controller/TraductorController';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'OLC1Practica2';

  //VARIABLES GLOBALES
  file:any;
  inputVar: string;
  lexicoAnalizer: any;
  sintacticoAnalizer: any;
  tokenController: any;
  traductorController: any;
  array:any[] = [];

  constructor() { 
    this.inputVar = "";
    this.lexicoAnalizer = LexicoAnalizer.getInstance();     
    this.sintacticoAnalizer = SintacticoAnalizer.getInstance();     
    this.tokenController = TokenController.getInstance();     
    this.traductorController = TraductorController.getInstance();     
  }


  /*Prueva*/
  arrayTabs: number[] = [];
  cargarTabs(){
    this.arrayTabs.push((this.arrayTabs.length + 1));
  }
  /*---------------------------*/

  //carga de archivos
  fileChanged(e) {
    this.file = e.target.files[0];
  }
  uploadDocument(id: number) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      var i = "textArea" + id;
      const textArea = document.getElementById(i);
      textArea.textContent = fileReader.result.toString();   
    }
    fileReader.readAsText( this.file );
  }

  enviar( str: string ){
    console.clear();
    this.tokenController.clear();
    this.traductorController.ClearTraduction();
    this.lexicoAnalizer.analizerThisText( str );
    
    /*//Se envia al sintactico si no hay error lexico
    if (this.lexicoAnalizer.getArrayListError == undefined) {
    }  else {
      console.log("errores lexicos")
    }*/

    //ANALIZADOR SINTACTICO
    //this.sintacticoAnalizer.obtenerLista(TokenController.getInstance().getArrayListToken);
    
    //TRADUCTOR
    this.traductorController.obtenerLista(TokenController.getInstance().getArrayListToken);
    console.log("---------------");
    this.traductorController.ShowTraduction();
    const textArea = document.getElementById("textAreaTraduccion");
    textArea.textContent = "";
    textArea.textContent = this.traductorController.ShowTraduction();


    /* */
    const textAreaHtml = document.getElementById("textAreaHtml");
    textAreaHtml.textContent = "";
    textAreaHtml.textContent = this.traductorController.ShowHTMLCode();

    /* */
    const textAreaJson = document.getElementById("textAreaJson");
    textAreaJson.textContent = "";
    textAreaJson.textContent = this.traductorController.ShowJSONCode();

    
    this.array = this.traductorController.GetVariables();
    console.log("entrada");
    
  }


}
