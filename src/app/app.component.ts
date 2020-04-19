import {Component, OnInit, ViewChild} from '@angular/core';
import { LexicoAnalizer } from '../app/analizer/LexicoAnalizer';
import { SintacticoAnalizer } from './analizer/SintacticoAnalizer';
import { TokenController } from './controller/TokenController';
import { TraductorController } from './controller/TraductorController';
import { TableController } from './controller/TableController';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit  {
  title = 'OLC1Practica2';


  //VARIABLES GLOBALES
  file: any;
  inputVar: string;
  lexicoAnalizer: any;
  sintacticoAnalizer: any;
  tokenController: any;
  traductorController: any;
  tableController: any;
  array: any[] = [];
  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    //this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.inputVar = "";
    this.lexicoAnalizer = LexicoAnalizer.getInstance();
    this.sintacticoAnalizer = SintacticoAnalizer.getInstance();
    this.tokenController = TokenController.getInstance();
    this.traductorController = TraductorController.getInstance();
    this.tableController = TableController.getInstance();
  }

  

  /*Prueva*/
  arrayTabs: number[] = [];
  cargarTabs() {
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
    fileReader.readAsText(this.file);
  }

  enviar(str: string) {
    console.clear();
    this.tokenController.clear();
    this.tableController.clear();
    this.sintacticoAnalizer.clear();
    this.traductorController.ClearTraduction();
    this.lexicoAnalizer.analizerThisText(str);

    //Se envia al sintactico si no hay error lexico
    if (this.lexicoAnalizer.getArrayListError == undefined) {
      //ANALIZADOR SINTACTICO
      this.sintacticoAnalizer.obtenerLista(TokenController.getInstance().getArrayListToken);

      //CONSOLA
      const textAreaConsola = document.getElementById("textAreaConsola");
      textAreaConsola.textContent = "";
      textAreaConsola.textContent = textAreaConsola.textContent + "\n" + this.sintacticoAnalizer.GetError();
      
      if( this.sintacticoAnalizer.GetError() == "" ){
        //TRADUCTOR
        this.traductorController.obtenerLista(TokenController.getInstance().getArrayListToken);
        console.log("---------------");
        const textArea = document.getElementById("textAreaTraduccion");
        textArea.textContent = "";
        textArea.textContent = this.traductorController.ShowTraduction();
        textAreaConsola.textContent = textAreaConsola.textContent + "\n"  + this.traductorController.GetError();
      }
     


      //HTML
      const textAreaHtml = document.getElementById("textAreaHtml");
      textAreaHtml.textContent = "";
      textAreaHtml.textContent = this.traductorController.ShowHTMLCode();
      //JSON
      const textAreaJson = document.getElementById("textAreaJson");
      textAreaJson.textContent = "";
      textAreaJson.textContent = this.traductorController.ShowJSONCode();

      this.array = this.tableController.getArrayList;

    } else {
      this.tokenController.showError();
    }

  }


}



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];