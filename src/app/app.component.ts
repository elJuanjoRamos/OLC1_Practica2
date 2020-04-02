import { Component } from '@angular/core';

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


  constructor() { this.inputVar = "" }


  //carga de archivos
  fileChanged(e) {
    this.file = e.target.files[0];
  }
  uploadDocument() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.inputVar = fileReader.result.toString();   
    }
    fileReader.readAsText(this.file);
  }


}
