import { Token } from '../models/Token';
import { TokenPyton } from '../models/TokenPyton';
import { TableController } from '../controller/TableController';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

export class TraductorController {

    private static instance: TraductorController;
    private arrayListToken: Token[] = [];
    private tableController: any;
    private index:number = 0;
    private currentToken:Token = null;
    private esMetodo:boolean = false;
    private esFuncion:boolean = false;
    private esSwitchRepeticion:number = 0;
    private esRepeticion:number = 0;
    //Prueba 
    private traductor: string = "";
    private arrayTraducido: TokenPyton[] = [];
    private htmlElements: string[] = [];
    private jsonElements: TokenPyton[] = [];
    private dataType = ['PR_void','PR_int', 'PR_double', 'PR_char', 'PR_bool', 'PR_string'];
    private strError = "";

    //PARTE DE TABLA DE SIMBOLOS
    //tipo de la variable
    private type: string = "";
    private ambit: string = "";
    private typeTemp: string = "";
    //identificador de la variable
    private id: string = "";
    //fila  de la variable
    private row: number = 0;


    constructor(){
        this.tableController = TableController.getInstance();
    }

    public static getInstance(): TraductorController {
        if (!TraductorController.instance) {
            TraductorController.instance = new TraductorController();
        }
        return TraductorController.instance;
    }

    obtenerLista(arrayListToken:Token[])
    {
        this.arrayListToken = arrayListToken;
        this.index = 0;
        this.currentToken = arrayListToken[this.index];
        this.inicio();
    }

    public inicio() {
        this.declaracionComentario();
        this.clase();
        this.declaracionComentario();
    }

     //CLASE Y METODO PRINCIPAL
    public clase() {
        if(this.currentToken.getDescription() == "PR_public") {
            this.emparejar("PR_public");
            this.emparejar("PR_class");
            this.ambit = "Global";
            this.traductor = "class " + this.currentToken.getLexema() + ":";
            this.InsertTraduction(this.traductor, "cadena");
            this.InsertTraduction("{", "TK_LlaveIzquierda");
            this.emparejar("Identificador");
            this.emparejar("TK_LlaveIzquierda");
            this.declaracionComentario();
            this.declaracionGlobal();
            this.declaracionComentario();
            this.emparejar("TK_LlaveDerecha");
            this.InsertTraduction("}", "TK_LlaveDerecha");
            
        } else {
            this.emparejar("PR_class");
            this.traductor = "class " + this.currentToken.getLexema() + ":";
            this.InsertTraduction(this.traductor, "cadena");
            this.InsertTraduction("{", "TK_LlaveIzquierda");
            this.emparejar("Identificador");
            this.emparejar("TK_LlaveIzquierda");
            this.declaracionComentario();
            this.declaracionGlobal();
            this.declaracionComentario();
            this.emparejar("TK_LlaveDerecha");
            this.InsertTraduction("}", "TK_LlaveDerecha");
        }
    }

    public declaracionGlobal() {
        this.declaracionComentario();
        this.declaracion();
        this.declaracionComentario();
        this.otraDeclaracionGlobal();
        this.declaracionComentario();
    }

    public declaracion(){
        if(this.currentToken.getDescription()!=null) {
            if(this.currentToken.getDescription() == 'PR_void') {
                this.emparejar("PR_void");
                this.type = "Metodo Void";
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.getDescription() == 'PR_main') {
                    this.InsertVariable(this.type, "Main", this.currentToken.getRow(), "Global");
                    this.ambit = "Metodo Main";
                    this.traductor =  this.traductor + "def main ";
                    this.declaracionComentario();
                    this.metodoPrincipal();
                    this.declaracionComentario();
                } else if(this.currentToken.getDescription() == 'Identificador') {
                    this.id = this.currentToken.getLexema();
                    this.row = this.currentToken.getRow();
                    this.InsertVariable(this.type, this.id, this.row, "Global");
                    this.ambit = "Metodo "+this.currentToken.getLexema() ;
                    this.metodoVoid();
                }
            } else if(this.dataType.includes(this.currentToken.getDescription())) { 
                this.declaracionComentario();
                this.tipoDeclaracion();
                this.declaracionComentario();
            }
        }
    }

    public tipoDeclaracion() {


        if(this.dataType.includes(this.currentToken.getDescription())) {
            this.type = this.currentToken.getLexema();
            this.typeTemp = this.currentToken.getLexema();
            this.emparejar(this.currentToken.getDescription());
            //traduce el identificicador
            this.traductor = this.traductor + this.currentToken.getLexema();
            this.id = this.currentToken.getLexema();
            this.row = this.currentToken.getRow();
            this.emparejar("Identificador");
            this.asignacionVariableGlobal();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.InsertVariable("Funcion " + this.type, this.id, this.row, this.ambit);
                this.ambit = "Funcion " + this.traductor;
                this.traductor = "def " + this.traductor + "(";
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.traductor = this.traductor+ "):";
                this.InsertTraduction(this.traductor, "cadena");
                this.InsertTraduction("{", "TK_LlaveIzquierda");
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.InsertTraduction("}", "TK_LlaveDerecha");
                this.emparejar("TK_LlaveDerecha");
                this.ambit = "Global";
                this.esFuncion = false;
            } else if(this.currentToken.getDescription() == "TK_Coma") {
                this.traductor = "var " + this.traductor;
                this.InsertVariable(this.type, this.id, this.row, this.ambit);   
                this.type = this.typeTemp;
                this.listaAsignacionGlobal();
                this.emparejar("TK_PuntoComa");
            } else if(this.currentToken.getDescription() == "TK_PuntoComa") {
                this.traductor = "var " + this.traductor; 
                this.emparejar("TK_PuntoComa");
                this.InsertTraduction(this.traductor, "cadena");
                this.InsertVariable(this.type, this.id, this.row, this.ambit);   
            }
        
    }
}

    public listaAsignacionGlobal() {
        this.masElementosGlobal();
    }

    public listaAsignacionGlobal2() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.id = this.currentToken.getLexema();
        this.row = this.currentToken.getRow();
        this.InsertVariable(this.type, this.id, this.row, this.ambit); 
        this.type = this.typeTemp;
        this.emparejar("Identificador");
        this.asignacionVariableGlobal();
        this.masElementosGlobal();
    }

    public masElementosGlobal() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.traductor = this.traductor + ",";
            this.emparejar("TK_Coma");
            this.listaAsignacionGlobal2();
        } else {
            //EPSILON
        }
    }

    public asignacionVariableGlobal() {

        if(this.currentToken.getDescription() == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.traductor = this.traductor + "=";
            this.expresion();
        } else {
            //EPSILON
        }
    }

    public valorVariableGlobal() {
        if(this.currentToken.getDescription() == "Digito") {
            this.emparejar("Digito");
        } else if(this.currentToken.getDescription() == "Cadena") {
            this.emparejar("Cadena");
        //FALTA CARACTER
        } else if(this.currentToken.getDescription() == "Caracter") {
            this.emparejar("Caracter");
        } else if(this.currentToken.getDescription() == "PR_true") {
            this.emparejar("PR_true");
        } else if(this.currentToken.getDescription() == "PR_false") {
            this.emparejar("PR_false");
        } else if(this.currentToken.getDescription() == "Identificador") {
            this.emparejar("Identificador");
            this.valorMetodoGlobal();
        }
    }

    public valorMetodoGlobal() {
        if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
            this.emparejar("TK_Parentesis_Izq");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Parentesis_Der") {
                this.emparejar("TK_Parentesis_Der");
            } else {
                //LISTADO DE ASIGNACIONES
                this.listaParametroAsignacion();
                this.emparejar("TK_Parentesis_Der");
            }
            
        } else {
            //EPSILON
        }
    }

    public otraDeclaracionGlobal(){
        if(this.currentToken.getDescription()!=null) {
            if(this.currentToken.getDescription() == 'PR_void') {
                this.declaracion();
                this.otraDeclaracionGlobal();
            }else if(this.dataType.includes(this.currentToken.getDescription())) {
                this.type = this.currentToken.getLexema();
                this.declaracion();
                this.otraDeclaracionGlobal();
            }
        }
    }

    public metodoPrincipal() {
        this.esMetodo = true;
        this.emparejar("PR_main");
        this.emparejar("TK_Parentesis_Izq");
        this.InsertTraduction(this.traductor+ "():", "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.parametroPrincipal();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.ambit = "Global";
        this.traductor = this.traductor + "if __name__ = \"__main__\": \n\tmain()";
        this.InsertTraduction(this.traductor, "cadena");
        this.esMetodo = false;
    }

    public metodoVoid() {
        this.esMetodo = true;
        this.traductor = "def " + this.traductor + this.currentToken.getLexema() + "(";
        this.emparejar("Identificador");
        this.emparejar("TK_Parentesis_Izq");
        this.declaracionParametros();
        this.traductor = this.traductor  + "):";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");

        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.ambit = "Global";
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.esMetodo = false;
    }

    public parametroPrincipal() {
        if (this.currentToken.getDescription() == "PR_string")
        {
            this.emparejar("PR_string");
            this.emparejar("TK_Corchete_Izq");
            this.emparejar("TK_Corchete_Der");
            this.emparejar("Identificador");
        } else {
            //EPSILON
        }
    }
    //DECLARACION PARAMETROS
    public declaracionParametros(){
        if(this.dataType.includes(this.currentToken.getDescription())) {
            this.type = this.currentToken.getLexema();
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }

    public listaParametro() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.InsertVariable(this.type, this.currentToken.getLexema(), this.currentToken.getRow(), this.ambit); 
        this.emparejar("Identificador");
        this.masParametros();
    }

    public masParametros() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.traductor = this.traductor + ",";
            this.emparejar("TK_Coma");
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }


//#region TRADUCIDOS
    //DECLARACION COMENTARIO
    public declaracionComentario() {
        this.comentario();
        this.otrosComentarios();
    }
    comentario() {
        if(this.currentToken!=null) {
            if (this.currentToken.getDescription() == ("ComentarioLinea"))
            {
                
                this.traductor = this.traductor + this.currentToken.getLexema().replace("//", "#");
                this.InsertTraduction(this.traductor, "cadena");
                this.emparejar("ComentarioLinea");
            } else if (this.currentToken.getDescription() == ("ComentarioMultilinea"))
            {
                this.traductor = this.traductor + this.currentToken.getLexema().replace("/*", "'''") ;
                this.traductor = this.traductor.replace("*/", "'''");
                this.InsertTraduction(this.traductor, "cadena");
                this.emparejar("ComentarioMultilinea");
            }
            else
            {
                //EPSILON
            }
        }
    }
    public otrosComentarios() {
        if(this.currentToken!=null) {
            if (this.currentToken.getDescription() == ("ComentarioLinea")
            || this.currentToken.getDescription() == ("ComentarioMultilinea"))
            {
                this.comentario();
                this.otrosComentarios();
            } else {
                //EPSILON
            }
        }
    }

//#endregion    
    

    //LISTA DECLARACION
    public listaDeclaracion() {
        if(this.currentToken != null) {
            if(this.dataType.includes(this.currentToken.getDescription())) {
                this.declaracionVariable();
            } else if (this.currentToken.getDescription() == ("ComentarioLinea")
            || this.currentToken.getDescription() == ("ComentarioMultilinea"))
            {
                this.declaracionComentario();
            } else if (this.currentToken.getDescription() == ("PR_if"))
            {
                this.DeclaracionIf();
            } else if (this.currentToken.getDescription() == ("PR_for"))
            {
                this.declaracionFor();
            } else if (this.currentToken.getDescription() == ("PR_while"))
            {
                this.declaracionWhile();
            } else if (this.currentToken.getDescription() == ("PR_switch"))
            {
                this.declaracionSwitch();
            } else if (this.currentToken.getDescription() == ("PR_do"))
            {
                this.declaracionDoWhile();
            } else if (this.currentToken.getDescription() == ("PR_console"))
            {
                this.declaracionConsole();
            } else if (this.currentToken.getDescription() == ("Identificador"))
            {
                this.declaracionSinTipo();
            } else if (this.currentToken.getDescription() == ("PR_return"))
            {
                this.declaracionRetorno();
            } else if (this.currentToken.getDescription() == ("PR_break"))
            {
                this.break();
            } else if (this.currentToken.getDescription() == ("PR_continue"))
            {
                this.continue();
            } else {
                //EPSILON
            }
        }
    }
    public declaracionRetorno() {
        if(this.esMetodo == true) {
            this.traductor = this.traductor + "return";
            this.emparejar("PR_return");
            //TIPO DE RETORNO
            this.emparejar("TK_PuntoComa");
        } else if(this.esFuncion == true) {
            this.traductor = this.traductor + "return ";
            this.emparejar("PR_return");
            //TIPO DE RETORNO
            this.condicionesReturn();
            this.InsertTraduction(this.traductor, "cadena");
            this.emparejar("TK_PuntoComa");
        }
        this.listaDeclaracion();
    }


    //DECLARACION CONSOLA
    public declaracionConsole() {
        this.traductor = this.traductor + "print(";
        this.emparejar("PR_console");
        this.emparejar("TK_Punto");
        this.emparejar(this.currentToken.getDescription());
        this.emparejar("TK_Parentesis_Izq");
        this.expresion();
        this.traductor = this.traductor + ")";
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_PuntoComa");
        this.InsertTraduction(this.traductor, "cadena");
        this.listaDeclaracion();
    }



    //#region  VARIABLE
    //DECLARACION VARIABLE
    public declaracionVariable() {
        this.declaracionComentario();
        this.asignacion();
        this.declaracionComentario();
        this.otraAsignacion();
        this.declaracionComentario();
        this.listaDeclaracion();
    }
    public asignacion() {
        this.tipoVariable();
        this.listaAsignacion();
        this.asignacionVariable();
        this.emparejar("TK_PuntoComa");
        this.InsertTraduction(this.traductor, "cadena");
        //this.InsertVariable(this.type, this.id, this.row, this.ambit);
    }

    public otraAsignacion() {
        if(this.currentToken != null) {
            if(this.dataType.includes(this.currentToken.getDescription())) {
                this.declaracionComentario();
                this.asignacion();
                this.declaracionComentario();
                this.otraAsignacion();
                this.declaracionComentario();
                this.listaDeclaracion();
            }
        } else {
            //EPSILON
        }
    }

    public tipoVariable() {
        this.traductor = this.traductor+ "var ";
        if(this.currentToken.getDescription() == "PR_int") {
            this.emparejar("PR_int");
            this.type = "int";
            this.typeTemp = "int";
        } else if(this.currentToken.getDescription() == "PR_double") {
            this.emparejar("PR_double");
            this.type = "double";
            this.typeTemp = "double";
        } else if(this.currentToken.getDescription() == "PR_char") {
            this.emparejar("PR_char");
            this.type = "char";
            this.typeTemp = "char";
        } else if(this.currentToken.getDescription() == "PR_bool") {
            this.emparejar("PR_bool");
            this.type = "bool";
            this.typeTemp = "bool";
        } else if(this.currentToken.getDescription() == "PR_string") {
            this.emparejar("PR_string");
            this.type = "string";
            this.typeTemp = "string"
        }
    }

    public listaAsignacion() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.id = this.currentToken.getLexema();
        this.row = this.currentToken.getRow();
        this.emparejar("Identificador");
        this.InsertVariable(this.type, this.id, this.row, this.ambit);
        this.type = this.typeTemp;
        if(this.currentToken.getDescription() == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.traductor = this.traductor + "=";
            this.expresion();
        } else {
            //EPSILON
        }
        this.masElementos();
    }


    public masElementos() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.traductor = this.traductor + ",";
            this.emparejar("TK_Coma");
            this.listaAsignacion();
        } else {
            this.InsertTraduction(this.traductor, "cadena");
            //EPSILON
        }
    }

    public asignacionVariable() {
        if(this.currentToken.getDescription() == "TK_Igual") {
            this.traductor = this.traductor + "= ";
            this.emparejar("TK_Igual");
            this.expresion();
        } else {
            //EPSILON
        }
    }

    //#endregion


    


    
    //DECLARACION IF ELSEIF ELSE
    public DeclaracionIf() {
        this.traductor = this.traductor + "if ";
        this.emparejar("PR_if");
        this.emparejar("TK_Parentesis_Izq");
        this.condiciones();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");

        this.InsertTraduction(this.traductor + ":", "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.declaracionComentario();
        this.else();
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    //CONDICION IF
    public condicion() {
        this.tipoCondicion();
        this.operacionRelacional();
        this.tipoCondicion();
    }

    public condicionFor(){
        this.emparejar(this.currentToken.getDescription());
        this.operacionRelacionalFor();
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.emparejar(this.currentToken.getDescription());
    }

    public tipoCondicion() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        if(this.currentToken.getDescription() == 'Identificador') {
            this.emparejar("Identificador");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.emparejar("Cadena");
        } else if(this.currentToken.getDescription() == 'Digito') {
            this.emparejar("Digito");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.emparejar("Cadena");
        } else if(this.currentToken.getDescription() == 'PR_null') {
            this.emparejar("PR_null");
        } else if(this.currentToken.getDescription() == 'PR_true') {
            this.emparejar("PR_true");
        } else if(this.currentToken.getDescription() == 'PR_false') {
            this.emparejar("PR_false");
        } else if(this.currentToken.getDescription() == 'Decimal') {
            this.emparejar("Decimal");
        }
    }

    public else() {
        if(this.currentToken.getDescription() == 'PR_else') {
            this.emparejar("PR_else");
            this.tipoElse();
        } else {
            //EPSILON
        }
    }
    /* PRUEBA*/
    public tipoElse() {
        if(this.currentToken.getDescription() == 'PR_if') {
            this.traductor = this.traductor + "elif ";
            
            this.declaracionComentario();
            this.declaracionElseIf();
            this.declaracionComentario();
            this.InsertTraduction("}", "TK_LlaveDerecha"); 
        } else if(this.currentToken.getDescription() == 'TK_LlaveIzquierda') {
            this.traductor = this.traductor + "else: "; 
            this.declaracionComentario();
            this.declaracionElse();
            this.declaracionComentario();
            this.InsertTraduction("}", "TK_LlaveDerecha");

        }
    }

    public declaracionElseIf() {
        this.declaracionComentario();
        this.elseIf();
        this.declaracionComentario();
        this.otroElseIf();
        this.declaracionComentario();
    }

    public elseIf() {
        if(this.currentToken.getDescription() == 'PR_if') {
            this.emparejar("PR_if");
            this.emparejar("TK_Parentesis_Izq");
            this.condicion();
            this.emparejar("TK_Parentesis_Der");
            this.emparejar("TK_LlaveIzquierda");
            this.InsertTraduction(this.traductor, "cadena");
            this.InsertTraduction("{", "TK_LlaveIzquierda");
            this.declaracionComentario();
            this.listaDeclaracion();
            this.declaracionComentario();
            this.emparejar("TK_LlaveDerecha");
        } else {
            //EPSILON
        }
    }

    public otroElseIf() {
        if(this.currentToken.getDescription() == 'PR_else') {
            this.declaracionComentario();
            this.else()
            this.declaracionComentario();
            this.elseIf();
            this.declaracionComentario();
            this.otroElseIf();
            this.declaracionComentario();
        } else {
            //EPSILON
        }
    }

    public declaracionElse() {
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.InsertTraduction(this.traductor + ":", "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
    }

    public declaracionFor() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.emparejar("PR_for");
        this.emparejar("TK_Parentesis_Izq");
        //INICIALIZACION
        this.emparejar("PR_int");
        this.traductor = this.traductor + "for " + this.currentToken.getLexema() + " in range(";
        this.emparejar("Identificador");
        this.emparejar("TK_Igual");
        this.traductor = this.traductor + this.currentToken.getLexema() + ", ";
        this.emparejar("Digito");
        this.emparejar("TK_PuntoComa");
        //CONDICION
        this.condicionFor();
        this.traductor = this.traductor + "):";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.emparejar("TK_PuntoComa");
        //INCREMENTO
        this.emparejar("Identificador");
        if(this.currentToken.getDescription() == 'TK_Suma') {
            this.emparejar("TK_Suma");
            this.emparejar("TK_Suma");
        } else if(this.currentToken.getDescription() == 'TK_Resta') {
            this.emparejar("TK_Resta");
            this.emparejar("TK_Resta");
        }
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public declaracionWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.traductor = this.traductor + "while ";
        this.emparejar("PR_while");
        this.emparejar("TK_Parentesis_Izq");
        //CONDICION
        this.condiciones();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.traductor = this.traductor + ":";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");

        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.emparejar("TK_LlaveDerecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public declaracionSwitch() {
        this.esSwitchRepeticion++;
        this.emparejar("PR_switch");
        this.emparejar("TK_Parentesis_Izq");
        this.traductor = this.traductor + "def switch(case,"+this.currentToken.getLexema() + "):";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.InsertTraduction("switcher = {", "cadena");

        this.InsertTraduction("{", "TK_LlaveIzquierda");

        this.emparejar("Identificador");
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.cuerpoSwitch();
        this.declaracionComentario();
        this.default();
        this.traductor = this.traductor + "}";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.esSwitchRepeticion--;
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public cuerpoSwitch() {
        this.declaracionComentario();
        this.case();
        this.declaracionComentario();
        this.otroCase();
        this.declaracionComentario();
    }

    public case() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == 'PR_case') {
                this.emparejar("PR_case");
                this.tipoCase();
                this.InsertTraduction(this.traductor + ":", "cadena");
                this.InsertTraduction("{", "TK_LlaveIzquierda");
                this.emparejar("TK_DosPuntos");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.InsertTraduction("}", "TK_LlaveDerecha");
            } else {
                //EPSILON
            }
        }
    }

    public tipoCase() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        if(this.currentToken.getDescription() == 'Identificador') {
            this.emparejar("Identificador");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.emparejar("Cadena");
        } else if(this.currentToken.getDescription() == 'Digito') {
            this.emparejar("Digito");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.emparejar("Cadena");
        } else if(this.currentToken.getDescription() == 'PR_null') {
            this.emparejar("PR_null");
        }
    }

    public otroCase() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == 'PR_case') {
                this.traductor = this.traductor + ",";
                this.declaracionComentario();
                this.case();
                this.declaracionComentario();
                this.otroCase();
                this.declaracionComentario();
            } else {
                //EPSILON
            }
        }
    }

    public break() {
        if(this.esSwitchRepeticion != 0) {
            if(this.currentToken.getDescription() != null) {
                this.emparejar("PR_break");
                this.traductor = this.traductor + "break";
                this.InsertTraduction(this.traductor, "cadena");
                this.emparejar("TK_PuntoComa");
                this.listaDeclaracion();
            }
        }
    }

    public continue() {
        if(this.esRepeticion != 0) {
            if(this.currentToken.getDescription() != null) {
                this.emparejar("PR_continue");
                this.traductor = this.traductor + "continue";
                this.InsertTraduction(this.traductor, "cadena");

                this.emparejar("TK_PuntoComa");
                this.listaDeclaracion();
            }
        }
    }

    public default() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == 'PR_default') {
                this.traductor = this.traductor + ",default";
                this.InsertTraduction(this.traductor + ":", "cadena");
                this.InsertTraduction("{", "TK_LlaveIzquierda");
                this.emparejar("PR_default");
                this.emparejar("TK_DosPuntos");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.InsertTraduction("}", "TK_LlaveDerecha");
            } else {
                //EPSILON
            }
        }
    }


    public valorVariable() {
        if(this.currentToken.getDescription() == "Digito") {
            this.emparejar("Digito");
        } else if(this.currentToken.getDescription() == "Cadena") {
            this.emparejar("Cadena");
        //FALTA CARACTER
        } else if(this.currentToken.getDescription() == "Caracter") {
            this.emparejar("Caracter");
        } else if(this.currentToken.getDescription() == "PR_true") {
            this.emparejar("PR_true");
        } else if(this.currentToken.getDescription() == "PR_false") {
            this.emparejar("PR_false");
        } else if(this.currentToken.getDescription() == "Identificador") {
            this.emparejar("Identificador");
        }
    }

    public operacionRelacional() {
        if(this.currentToken.getDescription() == "TK_Menor") {
            this.emparejar("TK_Menor");
            this.traductor = this.traductor + "<";
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.traductor = this.traductor + "=";
                this.emparejar("TK_Igual");
            } else {
                //EPSILON
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.emparejar("TK_Mayor");
            this.traductor = this.traductor + ">";
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.traductor = this.traductor + "=";
                this.emparejar("TK_Igual");
            } else {
                //EPSILON
            }
        } if(this.currentToken.getDescription() == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.emparejar("TK_Igual");
            this.traductor = this.traductor + "==";
        } if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.emparejar("TK_Exclamacion");
            this.emparejar("TK_Igual");
            this.traductor = this.traductor + "!=";
        } 
    }
    public operacionRelacionalFor() {
        if(this.currentToken.getDescription() == "TK_Menor") {
            this.emparejar("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.emparejar("TK_Igual");
            } else {
                //EPSILON
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.emparejar("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.emparejar("TK_Igual");
            } else {
                //EPSILON
            }
        } 
    }
    public operacionLogicoAndOr() {
        if(this.currentToken.getDescription() == "TK_Pleca") {
            this.emparejar("TK_Pleca");
            this.emparejar("TK_Pleca");
        } else if(this.currentToken.getDescription() == "TK_&") {
            this.emparejar("TK_&");
            this.emparejar("TK_&");
        }
    }

    public operacionLogicoNot() {
        if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.emparejar("TK_Exclamacion");
        }
    }

    public declaracionDoWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.emparejar("PR_do");
        this.traductor = this.traductor + "while True:"
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.emparejar("PR_while");
        this.emparejar("TK_Parentesis_Izq");
        //CONDICION
        this.traductor = this.traductor + "if (";
        this.condiciones();
        this.traductor = this.traductor + "):";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.InsertTraduction("break", "cadena");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_PuntoComa");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    //DECLARACION SIN TIPO
    public declaracionSinTipo() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.id = this.currentToken.getLexema();
        this.emparejar("Identificador");
        this.emparejar("TK_Igual");
        this.traductor = this.traductor + "=";
        this.expresion();
        this.emparejar("TK_PuntoComa");
        if(this.tableController.searchVariable(this.id) == false){
            this.strError = this.strError + "\n" + "*Error Sintactico: La variable '" + this.id + "' no ha sido declarada, Linea: "  + this.row; 
        } 
        this.InsertTraduction(this.traductor, "cadena");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    //EXPRESION
    public expresion() {
        this.termino();
        this.expresionPrima();
    }

    public termino() {
        this.factor();
        this.terminoPrima();
    }

    public expresionPrima() {
        if (this.currentToken.lexema == "+")
        {
            this.traductor = this.traductor + "+";
            this.emparejar(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "-")
        {
            this.traductor = this.traductor + "-";
            this.emparejar(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "|")
        {
            this.emparejar(this.currentToken.getDescription());
            this.emparejar(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }else if (this.currentToken.lexema == "&")
        {
            this.emparejar(this.currentToken.getDescription());
            this.emparejar(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        } else
        if(this.currentToken.getDescription() == "TK_Menor") {
            this.emparejar("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.evaluarSiguiente(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.emparejar("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.evaluarSiguiente(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.emparejar("TK_Igual");
            this.evaluarSiguiente(this.currentToken.getDescription());
        } else if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.emparejar("TK_Exclamacion");
            this.emparejar("TK_Igual");
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else
        {
            //EPSILON
        }
    }

    public evaluarSiguiente(texto:string) {
        if (this.currentToken.lexema != texto)
        {
            //console.error(this.currentToken.lexema)
            this.termino();
            this.expresionPrima();
        } else {
            //console.error(texto)
        }
    }

    public factor() {
        if (this.currentToken.lexema == "(")
        {
            this.emparejar(this.currentToken.getDescription());
            this.expresion();
            this.emparejar("TK_Parentesis_Der");
        }
        else if (this.currentToken.getDescription() == ("Digito") 
        || this.currentToken.getDescription() == ("Cadena")
        || this.currentToken.getDescription() == ("Decimal")
        || this.currentToken.getDescription() == ("Cadena_HTML")
        || this.currentToken.getDescription() == ("PR_true")
        || this.currentToken.getDescription() == ("Caracter")
        || this.currentToken.getDescription() == ("PR_false"))
        {
            if (this.currentToken.getDescription() == "Cadena_HTML") {
                this.getHtml(this.currentToken.getLexema());
            }
            this.traductor = this.traductor +this.currentToken.getLexema(); 
            this.emparejar(this.currentToken.getDescription());
        } else if (this.currentToken.getDescription() == ("Identificador"))
        {
            this.traductor = this.traductor +this.currentToken.getLexema(); 
            this.emparejar(this.currentToken.getDescription());
            this.valorMetodoGlobal();
        } else {
            console.error("Error se esperaba Digito o Cadena en lugar de " + this.currentToken.getDescription());
        }
    }

    public terminoPrima() {
        if (this.currentToken.lexema == "*")
        {
            this.emparejar(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "/")
        {
            this.emparejar(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else
        {
            //EPSILON
            //console.error(this.currentToken.lexema)
        }
    }

    public listaParametroAsignacion() {
        this.expresion();
        this.masParametrosAsignacion();
    }

    public masParametrosAsignacion() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.emparejar("TK_Coma");
            this.listaParametroAsignacion();
        } else {
            //EPSILON
        }
    }


     /*_______________________________________________NUEVAS CONDICIONES____________________________________________ */
     public condiciones() {
        if(this.currentToken.description != "TK_Parentesis_Der") {
            this.expresion2();
            this.masCondiciones();
        }
    }
    public masCondiciones() {
        if(this.currentToken.description == "TK_Pleca") {
            this.emparejar("TK_Pleca");
            this.emparejar("TK_Pleca");
            this.traductor = this.traductor + "||";
        }if(this.currentToken.description == "TK_&") {
            this.emparejar("TK_&");
            this.emparejar("TK_&");
            this.traductor = this.traductor + "&&";
        } else {
            //EPSILON
        }
        this.condiciones();
    }

    public expresion2() {
        this.termino2();
        this.expresionPrima2();
    }

    public termino2() {
        this.factor2();
        this.terminoPrima2();
    }
    public expresionPrima2() {
        if (this.currentToken.description != null)
        {
        if (this.currentToken.lexema == "+")
        {
            this.traductor = this.traductor + "+";
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente2(this.currentToken.description);
        }
        else if (this.currentToken.lexema == "-")
        {
            this.traductor = this.traductor + "-";
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        }else if(this.currentToken.description == "TK_Menor") {
            this.traductor = this.traductor + "<";
            this.emparejar("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.traductor = this.traductor + "=";
                this.evaluarSiguiente2(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Mayor") {
            this.emparejar("TK_Mayor");
            this.traductor= this.traductor + ">";
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.traductor= this.traductor + "=";
                this.evaluarSiguiente2(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.emparejar("TK_Igual");
            this.traductor = this.traductor + "==";
            this.evaluarSiguiente2(this.currentToken.description);
        } else if(this.currentToken.description == "TK_Exclamacion") {
            this.emparejar("TK_Exclamacion");
            this.emparejar("TK_Igual");
            this.traductor = this.traductor + "!=";
            this.evaluarSiguiente2(this.currentToken.description);
        }
        else
        {
            //EPSILON
        }   
        }
    }
    
    public evaluarSiguiente2(texto:string) {
        if (this.currentToken.lexema != texto)
        {
            //console.error(this.currentToken.lexema)
            this.termino2();
            this.expresionPrima2();
        } else {
            //console.error(texto)
        }
    }

    public factor2() {
        if(this.currentToken.description!=null) {
            if (this.currentToken.lexema == "(")
            {
                this.emparejar(this.currentToken.description);
                this.expresion2();
                this.emparejar("TK_Parentesis_Der");
            }
            else if (this.currentToken.description == ("Digito") 
            || this.currentToken.description == ("Cadena")
            || this.currentToken.description == ("Decimal")
            || this.currentToken.description == ("Cadena_HTML")
            || this.currentToken.description == ("Caracter")
            || this.currentToken.description == ("PR_true")
            || this.currentToken.description == ("PR_false"))
            {
                this.traductor = this.traductor + this.currentToken.getLexema();
                this.emparejar(this.currentToken.description);
            } else if (this.currentToken.description == ("Identificador"))
            {
                this.traductor = this.traductor + this.currentToken.getLexema();
                this.emparejar(this.currentToken.description);
            } else if (this.currentToken.description == ("TK_Exclamacion"))
            {
                this.traductor = this.traductor + "!";
                this.emparejar("TK_Exclamacion");
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.description == "Identificador") {
                    this.traductor = this.traductor + this.currentToken.getLexema();
                    this.emparejar("Identificador");
                } else if(this.currentToken.description == "PR_true" || this.currentToken.description == "PR_false") {
                    this.traductor = this.traductor + this.currentToken.getLexema();
                    this.emparejar(this.currentToken.description);
                }
            } else {
                console.error("Error se esperaba Digito o Cadena en lugar de " + this.currentToken.description);
            }
        }
    }

    public terminoPrima2() {
        if(this.currentToken.description!=null) {
            if (this.currentToken.lexema == "*")
            {
                this.traductor = this.traductor + "*";
                this.emparejar(this.currentToken.description);
                this.evaluarSiguiente2(this.currentToken.description);
            }
            else if (this.currentToken.lexema == "/")
            {
                this.traductor = this.traductor + "/";
                this.emparejar(this.currentToken.description);
                this.evaluarSiguiente2(this.currentToken.description);
            }
            else
            {
                //EPSILON
                //console.error(this.currentToken.lexema)
            }
        }
    }

     /*_______________________________________________CONDICIONES RETURN____________________________________________ */

     public condicionesReturn() {
        if(this.currentToken.description != "TK_PuntoComa") {
            this.expresion2();
            this.masCondicione3();
        }
    }

    public masCondicione3() {
        if(this.currentToken.description == "TK_Pleca") {
            this.emparejar("TK_Pleca");
            this.emparejar("TK_Pleca");
            this.traductor = this.traductor + "||";
        }if(this.currentToken.description == "TK_&") {
            this.emparejar("TK_&");
            this.emparejar("TK_&");
            this.traductor = this.traductor + "&&";
        } else {
            //EPSILON
        }
        this.condicionesReturn();
    }

    public expresion3() {
        this.termino3();
        this.expresionPrima3();
    }

    public termino3() {
        this.factor3();
        this.terminoPrima3();
    }

    public expresionPrima3() {
        if (this.currentToken.description != null)
        {
        if (this.currentToken.lexema == "+")
        {
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente3(this.currentToken.description);
        }
        else if (this.currentToken.lexema == "-")
        {
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        }else if(this.currentToken.description == "TK_Menor") {
            this.emparejar("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.evaluarSiguiente3(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente3(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Mayor") {
            this.emparejar("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.evaluarSiguiente3(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente3(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.emparejar("TK_Igual");
            this.evaluarSiguiente3(this.currentToken.description);
        } else if(this.currentToken.description == "TK_Exclamacion") {
            this.emparejar("TK_Exclamacion");
            this.emparejar("TK_Igual");
            this.evaluarSiguiente3(this.currentToken.description);
        }
        else
        {
            //EPSILON
        }   
        }
    }

    public evaluarSiguiente3(texto:string) {
        if (this.currentToken.lexema != texto)
        {
            //console.error(this.currentToken.lexema)
            this.termino3();
            this.expresionPrima3();
        } else {
            //console.error(texto)
        }
    }

    public factor3() {
        if(this.currentToken.description!=null) {
            if (this.currentToken.lexema == "(")
            {
                this.emparejar(this.currentToken.description);
                this.expresion3();
                this.emparejar("TK_Parentesis_Der");
            }
            else if (this.currentToken.description == ("Digito") 
            || this.currentToken.description == ("Cadena")
            || this.currentToken.description == ("Decimal")
            || this.currentToken.description == ("Cadena_HTML")
            || this.currentToken.description == ("Caracter")
            || this.currentToken.description == ("PR_true")
            || this.currentToken.description == ("PR_false"))
            {
                this.emparejar(this.currentToken.description);
            } else if (this.currentToken.description == ("Identificador"))
            {
                this.emparejar(this.currentToken.description);
            } else if (this.currentToken.description == ("TK_Exclamacion"))
            {
                this.emparejar("TK_Exclamacion");
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.description == "Identificador") {
                    this.emparejar("Identificador");
                } else if(this.currentToken.description == "PR_true" || this.currentToken.description == "PR_false") {
                    this.emparejar(this.currentToken.description);
                }
            } else {
                console.error("Error se esperaba Digito o Cadena en lugar de " + this.currentToken.description);
            }
        }
    }

    public terminoPrima3() {
        if(this.currentToken.description!=null) {
            if (this.currentToken.lexema == "*")
            {
                this.emparejar(this.currentToken.description);
                this.evaluarSiguiente3(this.currentToken.description);
            }
            else if (this.currentToken.lexema == "/")
            {
                this.emparejar(this.currentToken.description);
                this.evaluarSiguiente3(this.currentToken.description);
            }
            else
            {
                //EPSILON
                //console.error(this.currentToken.lexema)
            }
        }
    }



    public emparejar(token:string)
    {
        if(this.currentToken!=null){
            if (this.currentToken.getDescription()!=token)
            {
                //ERROR SI NO VIENE LO QUE DEBERIA
                console.error("Error se esperaba "+ token + " en lugar de " + this.currentToken.getDescription());
                //RECUPERACION MODO PANICO
                for (let index = this.index; index < this.arrayListToken.length; index++) {
                    console.log(this.currentToken.getDescription())
                    this.currentToken = this.arrayListToken[this.index];
                    if(this.currentToken.getDescription() == "TK_PuntoComa" 
                    || this.currentToken.getDescription() == "TK_LlaveDerecha"
                    || this.currentToken.getDescription() == "TK_LlaveIzquierda"
                    || this.currentToken.getDescription() == "PR_void"
                    || this.currentToken.getDescription() == "PR_int"
                    || this.currentToken.getDescription() == "PR_string"
                    || this.currentToken.getDescription() == "PR_double"
                    || this.currentToken.getDescription() == "PR_char"
                    || this.currentToken.getDescription() == "PR_bool") {
                        this.currentToken = this.arrayListToken[this.index];
                        break;
                    }
                    this.index += 1;
                }
            }
            //FLUJO CORRECTO
            if (this.currentToken.getDescription()==token)
            {
                console.log(this.currentToken.toString())
                this.index += 1;
                this.currentToken = this.arrayListToken[this.index];
            }
        }
    }


    public InsertVariable(type: string, id: string, row: number, ambit: string){
        if(this.tableController.searchVariable(id) == false){
            this.tableController.InsertToken(id, type, ambit, row);
        } else {
            this.strError = this.strError + "\n" + "*Error Sintactico: La variable '" + id + "' ya fue declarada, Linea: " + row;
        }
        this.row = 0;
        this.id = this.type = "";
    }

    /* OBTIENE LA CADENA HTML A TRADUCIR*/
    public getHtml( str:string ){
        str = str.replace("'", " ").trim();
        var newElement: string = "";

        for (let i = 0; i < str.length; i++) {
            const element = str[i];

            if(element == "<"){
                if(newElement != ""){
                    this.htmlElements.push(newElement.trim());
                }  
                newElement = "";
                newElement += element; 
                
                for (let j = i+1; j < str.length; j++) {
                    const e = str[j];
                    newElement += e;
                    if( e == ">"){
                        if( newElement.includes("</") ){
                            this.htmlElements.push("}");
                            this.htmlElements.push(newElement.trim());
                        } else {
                            this.htmlElements.push(newElement.trim());
                            this.htmlElements.push("{");
                        }
                        i  = j;  
                        newElement = "";
                        break;
                    }  
                }
            } else {
                newElement += element; 
            }   
        }
        this.htmlElements.forEach(e => {
            if(!(e.includes("</"))){
                if( e.includes("<") && e.includes(">")){
                   if (e.toLocaleLowerCase().includes("style")) {
                    
                    var splited = e.toLowerCase().split("style=");     
                    this.jsonElements.push( new TokenPyton( '"' + splited[0].replace('<', "").replace(">", "").toLocaleUpperCase() + '"' + ":{", "cadena") );
                    this.jsonElements.push( new TokenPyton("{", "TK_LlaveIzquierda") );         
                    this.jsonElements.push( new TokenPyton( '"' + "STYLE" + '":' + splited[1].replace('<', "").replace(">", ""), "cadena") );
                    
                } else {
                        e = e.replace("<", '"').replace(">", '"');
                        this.jsonElements.push( new TokenPyton(e.toLocaleUpperCase() + ":{", "cadena") );
                        this.jsonElements.push( new TokenPyton("{", "TK_LlaveIzquierda") );         
                    }
                } else {
                    if((e != "}") && (e != "{")){
                        this.jsonElements.push( new TokenPyton("\"TEXTO\": "+ '"' +e + '"', "cadena") );
                    }
                }
            } else {
                this.jsonElements.push( new TokenPyton("}", "cadena") );
                this.jsonElements.push( new TokenPyton("}", "TK_LlaveDerecha") );
            }
        });
       
    }
    /*INSERTA ELEMENTOS EN EL ARREGLO DE TRADUCCION*/
    public InsertTraduction( lexema: string, description: string ){
        if (lexema != "") {
            this.arrayTraducido.push( new TokenPyton(lexema, description) );
        }  
        this.traductor = "";
    }
    /* LIMPIA LOS ARREGLOS*/
    public ClearTraduction(){
        this.arrayTraducido = [];
        this.htmlElements = [];
        this.jsonElements = [];
        this.traductor = "";
        this.strError = "";
    } 


    /* METODOS PARA ORDENAR LA TRADUCCION*/
    public ShowTraduction(): string {
        var i:number = 0; 
        var tabs:string = "";
        var newElement:string = "";
        for (let index = 0; index < this.arrayTraducido.length; index++) {
            const element:TokenPyton = this.arrayTraducido[index];
            
            if (element.getDescription() == "TK_LlaveIzquierda") {
                i++;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }    
            } else if(element.getDescription() == "TK_LlaveDerecha"){
                i--;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }
            } else {
                newElement = newElement + "\n" + tabs + element.getLexema();
            }
        }
        return newElement;   
    }
    public ShowHTMLCode(): string {
        var i:number = 0; 
        var tabs:string = "";
        var newElement:string = "";
        for (let index = 0; index < this.htmlElements.length; index++) {
            const element:string = this.htmlElements[index];
            
            if (element == "{") {
                i++;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }    
            } else if(element == "}"){
                i--;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }
            } else {
                newElement = newElement + "\n" + tabs + element;
            }
        }
        return newElement;   
    }
    public ShowJSONCode(): string {
        var i:number = 0; 
        var tabs:string = "";
        var newElement:string = "";
        for (let index = 0; index < this.jsonElements.length; index++) {
            const element:TokenPyton = this.jsonElements[index];
            
            if (element.getDescription() == "TK_LlaveIzquierda") {
                i++;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }    
            } else if(element.getDescription() == "TK_LlaveDerecha"){
                i--;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }
            } else {
                newElement = newElement + "\n" + tabs + element.getLexema();
            }
        }
        return newElement;   
    }
    public GetError(): string {
        var str = this.strError;
        return str;
    }
}