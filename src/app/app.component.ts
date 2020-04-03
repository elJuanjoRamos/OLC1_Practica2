import { Component } from '@angular/core';
import { LexicoAnalizer } from '../app/analizer/LexicoAnalizer';
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

  constructor() { 
    this.inputVar = "";
    this.lexicoAnalizer = LexicoAnalizer.getInstance();     
  }


  //carga de archivos
  fileChanged(e) {
    this.file = e.target.files[0];
  }
  uploadDocument() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.inputVar = fileReader.result.toString();   
    }
    fileReader.readAsText( this.file );
  }

  enviar(){
    this.lexicoAnalizer.analizerThisText( this.inputVar );
    this.lexicoAnalizer.show();
    this.lexicoAnalizer.showError();
  }


}
