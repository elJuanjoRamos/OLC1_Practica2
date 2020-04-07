import { TokenController } from '../controller/TokenController';
export class LexicoAnalizer {

    //GLOBAL VARIABLES
    private auxiliar: string = "";
    private controller: any;
    private PUNTUACION = ['!', '&', '.', ',', ':', ';', '{', '}', '[', ']', '(', ')', '?', '*', '/', '"', '-', "'"];
    private SYMBOL = ['<', '>', '+', '|', '=', '_'];

    //SINGLETON
    private static instance: LexicoAnalizer;
    private constructor() {
        this.controller = TokenController.getInstance();
    }

    public static getInstance(): LexicoAnalizer {
        if (!LexicoAnalizer.instance) {
            LexicoAnalizer.instance = new LexicoAnalizer();
        }
        return LexicoAnalizer.instance;
    }


    analizerThisText(textInput: string) {

        var state: number = 0;
        var column: number = 0;
        var row: number = 1;;
        textInput = textInput + "\n"; //se agrega el hash del final
        var delimiter = textInput.length;
        for (let i = 0; i < textInput.length; i++) {
            var letra = textInput[i];
            column++;
            switch (state) {
                case 0:
                    //SI VIENE LETRA
                    if (this.IsLetter(letra) == true) {
                        state = 1;
                        this.auxiliar += letra;

                    }
                    //SI VIENE SALTO DE LINEA
                    else if (letra == '\n') {
                        state = 0;
                        column = 0;//COLUMNA 0
                        row++; //FILA INCREMENTA
                    }
                    //VERIFICA ESPACIOS EN BLANCO
                    else if (letra == ' ' || letra.charCodeAt(0) == 13) {
                        //column++;
                        state = 0;
                    }
                    //VERIFICA SI VIENE NUMERO
                    else if (this.IsDigit(letra)) {
                        state = 2;
                        this.auxiliar += letra;
                    }
                    //VERIFICA SI ES PUNTUACION
                    else if (this.IsPunctuation(letra)) {
                        if (letra == "!") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Exclamacion");
                        }
                        else if (letra == "&") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_&");
                        }
                        else if (letra == ".") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Punto");
                        }
                        else if (letra == ",") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Coma");
                        }
                        else if (letra == ":") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_DosPuntos");
                        }
                        else if (letra == ";") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_PuntoComa");
                        }
                        else if (letra == "{") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_LlaveIzquierda");
                        }
                        else if (letra == "}") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_LlaveDerecha");
                        }
                        else if (letra == "[") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Corchete_Izq");
                        }
                        else if (letra == "(") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Parentesis_Izq");
                        }
                        else if (letra == ")") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Parentesis_Der");
                        }
                        else if (letra == "]") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Corchete_Der");
                        }
                        else if (letra == "?") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Interrogacion");
                        }
                        else if (letra == "*") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Multiplicacion");
                        }
                        else if (letra == "/") {
                            state = 3;
                            this.auxiliar += letra;
                        }
                        else if (letra == '"') {
                            state = 8;
                            this.auxiliar += letra;
                        }
                        else if (letra == "'") {
                            state = 10;
                            this.auxiliar += letra;
                        }
                        else if (letra == "-") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Resta");
                        }
                    }
                    else if( this.IsSymbol(letra) ) {
                        if (letra == "<") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Menor");
                        }
                        else if (letra == ">") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Mayor");
                        } 
                        else if (letra == "+") {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Suma");
                        } 
                        else if (letra == '|') {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Pleca");
                        } 
                        else if (letra == '=') {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Igual");
                        } 
                        else if (letra == '_') {
                            this.controller.InsertToken(row, column - 1, letra.toString(), "TK_Guion_Bajo");
                        }
                    }
                    else {
                        this.controller.InsertError(row, column, letra.toString(), "TK_Desconocido");
                        state = 0;
                    }
                    break;
                case 1:
                    if (this.IsLetter(letra) || this.IsDigit(letra) || letra == '_') {
                        this.auxiliar += letra;
                        state = 1;
                    }
                    else {
                        const reservada = ['int', 'string', 'double', 'char', 'bool', 'public', 'class',
                        'static', 'void', 'Main', 'return', 'true', 'false', 'for', 'if', 'while', 'else'];

                        if (reservada.includes(this.auxiliar)) {
                            this.controller.InsertToken(row, (column - this.auxiliar.length - 1), this.auxiliar, "PR_" + this.auxiliar);
                        }
                        else {
                            this.controller.InsertToken(row, (column - this.auxiliar.length - 1), this.auxiliar, "Identificador");
                        }
                        this.auxiliar = "";
                        state = 0;
                    }
                    break;
                case 2:
                    if (this.IsDigit(letra)) {
                        this.auxiliar += letra;
                        state = 2;
                    }
                    else {
                        this.controller.InsertToken(row, column, this.auxiliar, "Digito");
                        this.auxiliar = "";
                        i--;
                        column--;
                        state = 0;
                    }
                    break;
                case 3:
                    if (letra == '/') {
                        state = 4;
                        this.auxiliar += letra;
                    } else if (letra == '*') {
                        state = 5;
                        i--;
                        column--;
                    } else {
                        this.controller.InsertToken(row, column, "/", "TK_Division");
                        i--;
                        column--;
                        state = 0;    
                    }   
                    break;
                case 4:
                    if (letra != '\n') {
                        this.auxiliar += letra;
                        state = 4;
                    }
                    else {
                        this.controller.InsertToken(row, 0, this.auxiliar, "ComentarioLinea");
                        row++; column = 0;
                        state = 0;
                        this.auxiliar = "";
                    }
                    break;
                case 5:
                    if (letra == '*') {
                        state = 6;
                        this.auxiliar += letra;
                    }
                    else {
                        this.auxiliar = "";
                        this.controller.InsertToken(row, column - 1, "/", "TK_Division");
                        state = 0;
                        i--;
                    }
                    break;
                case 6:
                    if (letra != '*') {
                        if (letra == '\n') { row++; column = 0; }
                        this.auxiliar += letra;
                        state = 6;
                    }
                    else {
                        this.auxiliar += letra;
                        state = 7;
                    }
                    break;
                case 7:
                    if (letra == '/') {
                        this.auxiliar += letra;
                        this.controller.InsertToken(row, column, this.auxiliar, "ComentarioMultilinea");
                        state = 0;
                        this.auxiliar = "";
                    } else{
                        this.controller.InsertError(row, column, this.auxiliar, "TK_Desconocido");
                        var index: number = i;
                        for (index = i; index < textInput.length; index++){
                            var error = textInput[index];
                            if (error == '\n') {
                                i = index;
                                break;
                            } else if (error != ' ') {
                                this.controller.InsertError(row, column, error, "TK_Desconocido");       
                            }                            
                        }
                        state = 0;
                        this.auxiliar = "";
                    }  
                    break;
                case 8:
                    if (letra != '"') {
                        if (letra == '\n') { row++; column = 0; }
                        this.auxiliar += letra;
                        state = 8;
                    }
                    else {
                        state = 9;
                        this.auxiliar += letra;
                        i--; column--;
                    }
                    break;
                case 9:
                    if (letra == '"') {
                        this.controller.InsertToken(row, (column - this.auxiliar.length), this.auxiliar, "Cadena");
                        state = 0;
                        this.auxiliar = "";
                    }
                    break;
                case 10: 
                    if (letra != "'") {
                        if (letra == '\n') { row++; column = 0; }
                        this.auxiliar += letra;
                        state = 10;
                    }
                    else {
                        state = 11;
                        this.auxiliar += letra;
                        i--; column--;
                    }
                    break;  
                case 11: 
                    if (letra == "'") {
                        this.controller.InsertToken(row, (column - this.auxiliar.length), this.auxiliar, "Cadena_HTML");
                        state = 0;
                        this.auxiliar = "";
                    }
                    break;  
                default:
                    this.controller.InsertToken(row, column, letra.toString(), "TD_Desconocido");
                    break;
            }
        }
    }


    IsLetter( str: string ): boolean {
        var char=str.toLowerCase(); 
        return (char>='a' && char<='z');
    }
    IsDigit( str: any ): boolean {
        var charCodeZero = "0".charCodeAt(0);
        var charCodeNine = "9".charCodeAt(0);
        return (str.charCodeAt(0) >= charCodeZero && str.charCodeAt(0) <= charCodeNine);
    }

    IsPunctuation( str: string) : boolean {
        if ( this.PUNTUACION.includes(str) ) {
            return true;
        }    
        return false;
    }

    IsSymbol( str: string) : boolean {
        if ( this.SYMBOL.includes(str) ) {
            return true;
        }    
        return false;
    }

    show(){
        this.controller.show();
    }
    showError(){
        this.controller.showError();
    }
}