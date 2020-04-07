import { Component,  ViewChild, ElementRef, Renderer2, Pipe, PipeTransform } from '@angular/core';
import { LexicoAnalizer } from '../app/analizer/LexicoAnalizer';
import { SintacticoAnalizer } from './analizer/SintacticoAnalizer';
import { TokenController } from './controller/TokenController';

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
  

  constructor(private renderer: Renderer2) { 
    this.inputVar = "";
    this.lexicoAnalizer = LexicoAnalizer.getInstance();     
    this.sintacticoAnalizer = SintacticoAnalizer.getInstance();     
    this.tokenController = TokenController.getInstance();     
  }


  /*Prueva*/
  arrayTabs: number[] = [1];
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
      const el = document.getElementById(i);
      el.textContent = fileReader.result.toString();   
    }
    fileReader.readAsText( this.file );
  }

  enviar( str: string ){
    console.clear();
    console.log(str);
    /*this.tokenController.clear();
    this.lexicoAnalizer.analizerThisText( this.inputVar );
    this.lexicoAnalizer.show();
    this.lexicoAnalizer.showError();
    */
    //ANALIZADOR SINTACTICO
    //this.sintacticoAnalizer.obtenerLista(TokenController.getInstance().getArrayListToken);
  }


}
