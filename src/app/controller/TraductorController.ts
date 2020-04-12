import { Token } from '../models/Token';
import { TokenPyton } from '../models/TokenPyton';

export class TraductorController {

    private static instance: TraductorController;
    private arrayListToken: Token[] = [];
    private index:number = 0;
    private currentToken:Token = null;
    private tokenInicio:String = "";
    private errorSintactico:boolean = false;
    private strTraductor:String;
    private esMetodo:boolean = false;
    private esFuncion:boolean = false;
    private esSwitchRepeticion:number = 0;
    private esRepeticion:number = 0;

    //Prueba 
    private traductor: string = "";
    private arrayTraducido: TokenPyton[] = [];
    private dataType = ['PR_void','PR_int', 'PR_double', 'PR_char', 'PR_bool', 'PR_String'];

   
    constructor(){
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
        if(this.currentToken.description == "PR_public") {
            this.emparejar("PR_public");
            this.emparejar("PR_class");
            this.emparejar("Identificador");
            this.emparejar("TK_LlaveIzquierda");
            this.declaracionComentario();
            this.declaracionGlobal();
            this.declaracionComentario();
            this.emparejar("TK_LlaveDerecha");
        } else {
            this.emparejar("PR_class");
            this.emparejar("Identificador");
            this.emparejar("TK_LlaveIzquierda");
            this.declaracionComentario();
            this.declaracionGlobal();
            this.declaracionComentario();
            this.emparejar("TK_LlaveDerecha");
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
        if(this.currentToken.description!=null) {
            if(this.currentToken.description == 'PR_void') {
                this.emparejar("PR_void");
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.description == 'PR_Main') {
                    this.traductor =  this.traductor + "def main ";
                    this.declaracionComentario();
                    this.metodoPrincipal();
                    this.declaracionComentario();
                } else if(this.currentToken.description == 'Identificador') {
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


        if(this.dataType.includes(this.currentToken.description)) {
            
            this.emparejar(this.currentToken.description);

            //traduce el identificicador
            this.traductor = this.traductor + this.currentToken.getLexema();

            this.emparejar("Identificador");
            this.asignacionVariableGlobal();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.description == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.traductor = "def " + this.traductor + "(";
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.traductor = this.traductor+ "):";
                this.InsertTraduction(this.traductor, "cadena");
                this.InsertTraduction("{", "TK_DosPuntos");
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.description == "TK_Coma") {
                this.traductor = "var " + this.traductor;
                this.listaAsignacionGlobal();
                this.emparejar("TK_PuntoComa");
            } else if(this.currentToken.description == "TK_PuntoComa") {
                this.traductor = "var " + this.traductor; 
                this.emparejar("TK_PuntoComa");
                this.InsertTraduction(this.traductor, "cadena");
            }
        
    }
}

    public listaAsignacionGlobal() {
        this.masElementosGlobal();
    }

    public listaAsignacionGlobal2() {
        this.traductor = this.traductor + this.currentToken.getLexema(); 
        this.emparejar("Identificador");
        this.asignacionVariableGlobal();
        this.masElementosGlobal();
    }

    public masElementosGlobal() {
        if(this.currentToken.description == "TK_Coma") {
            this.traductor = this.traductor + ",";
            this.emparejar("TK_Coma");
            this.listaAsignacionGlobal2();
        } else {
            //EPSILON
        }
    }

    public asignacionVariableGlobal() {

        if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.traductor = this.traductor + "=";
            this.expresion();
        } else {
            //EPSILON
        }
    }

    public valorVariableGlobal() {
        if(this.currentToken.description == "Digito") {
            this.emparejar("Digito");
        } else if(this.currentToken.description == "Cadena") {
            this.emparejar("Cadena");
        //FALTA CARACTER
        } else if(this.currentToken.description == "Caracter") {
            this.emparejar("Caracter");
        } else if(this.currentToken.description == "PR_true") {
            this.emparejar("PR_true");
        } else if(this.currentToken.description == "PR_false") {
            this.emparejar("PR_false");
        } else if(this.currentToken.description == "Identificador") {
            this.emparejar("Identificador");
            this.valorMetodoGlobal();
        }
    }

    public valorMetodoGlobal() {
        if(this.currentToken.description == "TK_Parentesis_Izq") {
            this.emparejar("TK_Parentesis_Izq");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Parentesis_Der") {
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
        if(this.currentToken.description!=null) {
            if(this.currentToken.description == 'PR_void') {
                this.declaracion();
                this.otraDeclaracionGlobal();
            }else if(this.dataType.includes(this.currentToken.getDescription())) {
                this.declaracion();
                this.otraDeclaracionGlobal();
            }
        }
    }

    public metodoPrincipal() {
        this.esMetodo = true;
        this.emparejar("PR_Main");
        this.emparejar("TK_Parentesis_Izq");
        this.traductor = this.traductor + "():";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.parametroPrincipal();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.InsertTraduction("}", "TK_LlaveDerecha");
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
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.esMetodo = false;
    }

    public parametroPrincipal() {
        if (this.currentToken.description == "PR_String")
        {
            this.emparejar("PR_String");
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
                this.tipoVariable();
                this.listaParametro();
        } else {
            //EPSILON
        }
    }

    public listaParametro() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.emparejar("Identificador");
        this.masParametros();
    }

    public masParametros() {
        if(this.currentToken.description == "TK_Coma") {
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
            if (this.currentToken.description == ("ComentarioLinea"))
            {
                
                this.traductor = this.traductor + this.currentToken.getLexema().replace("//", "#");
                this.InsertTraduction(this.traductor, "cadena");
                this.emparejar("ComentarioLinea");
            } else if (this.currentToken.description == ("ComentarioMultilinea"))
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
            if (this.currentToken.description == ("ComentarioLinea")
            || this.currentToken.description == ("ComentarioMultilinea"))
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
            } else if (this.currentToken.description == ("ComentarioLinea")
            || this.currentToken.description == ("ComentarioMultilinea"))
            {
                this.comentario();
                this.otrosComentarios();
            } else if (this.currentToken.description == ("PR_if"))
            {
                this.DeclaracionIf();
            } else if (this.currentToken.description == ("PR_for"))
            {
                this.declaracionFor();
                
            } else if (this.currentToken.description == ("PR_while"))
            {
                this.declaracionWhile();
            } else if (this.currentToken.description == ("PR_switch"))
            {
                this.declaracionSwitch();
            } else if (this.currentToken.description == ("PR_do"))
            {
                this.declaracionDoWhile();
            } else if (this.currentToken.description == ("PR_Console"))
            {
                this.declaracionConsole();
            } else if (this.currentToken.description == ("Identificador"))
            {
                this.declaracionSinTipo();
            } else if (this.currentToken.description == ("PR_return"))
            {
                this.declaracionRetorno();
            } else if (this.currentToken.description == ("PR_break"))
            {
                this.break();
            } else if (this.currentToken.description == ("PR_continue"))
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
            this.emparejar("PR_return");
            //TIPO DE RETORNO
            this.traductor = this.traductor + "return ";
            this.expresion();
            this.emparejar("TK_PuntoComa");
        }
        this.listaDeclaracion();
    }
    //DECLARACION CONSOLA
    public declaracionConsole() {
        this.traductor = this.traductor + "print(";
        this.emparejar("PR_Console");
        this.emparejar("TK_Punto");
        this.emparejar("PR_Write");
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
        if(this.currentToken.description == "PR_int") {
            this.emparejar("PR_int");
        } else if(this.currentToken.description == "PR_double") {
            this.emparejar("PR_double");
        } else if(this.currentToken.description == "PR_char") {
            this.emparejar("PR_char");
        } else if(this.currentToken.description == "PR_bool") {
            this.emparejar("PR_bool");
        } else if(this.currentToken.description == "PR_String") {
            this.emparejar("PR_String");
        }
    }

    public listaAsignacion() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.emparejar("Identificador");
        this.masElementos();
    }

    public masElementos() {
        if(this.currentToken.description == "TK_Coma") {
            this.traductor = this.traductor + ",";
            this.emparejar("TK_Coma");
            this.listaAsignacion();
        } else {
            //EPSILON
        }
    }

    public asignacionVariable() {
        if(this.currentToken.description == "TK_Igual") {
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
        this.condicion();
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
        if(this.currentToken.description == 'Identificador') {
            this.emparejar("Identificador");
        } else if(this.currentToken.description == 'Cadena') {
            this.emparejar("Cadena");
        } else if(this.currentToken.description == 'Digito') {
            this.emparejar("Digito");
        } else if(this.currentToken.description == 'Cadena') {
            this.emparejar("Cadena");
        } else if(this.currentToken.description == 'PR_null') {
            this.emparejar("PR_null");
        } else if(this.currentToken.description == 'PR_true') {
            this.emparejar("PR_true");
        } else if(this.currentToken.description == 'PR_false') {
            this.emparejar("PR_false");
        } else if(this.currentToken.description == 'Decimal') {
            this.emparejar("Decimal");
        }
    }

    public else() {
        if(this.currentToken.description == 'PR_else') {
            this.emparejar("PR_else");
            this.tipoElse();
        } else {
            //EPSILON
        }
    }
    /* PRUEBA*/
    public tipoElse() {
        if(this.currentToken.description == 'PR_if') {
            this.traductor = this.traductor + "elif ";
            
            this.declaracionComentario();
            this.declaracionElseIf();
            this.declaracionComentario();
            this.InsertTraduction("}", "TK_LlaveDerecha"); 
        } else if(this.currentToken.description == 'TK_LlaveIzquierda') {
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
        if(this.currentToken.description == 'PR_if') {
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
        if(this.currentToken.description == 'PR_else') {
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
        if(this.currentToken.description == 'TK_Suma') {
            this.emparejar("TK_Suma");
            this.emparejar("TK_Suma");
        } else if(this.currentToken.description == 'TK_Resta') {
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
        this.condicion();
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
            if(this.currentToken.description == 'PR_case') {
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
        if(this.currentToken.description == 'Identificador') {
            this.emparejar("Identificador");
        } else if(this.currentToken.description == 'Cadena') {
            this.emparejar("Cadena");
        } else if(this.currentToken.description == 'Digito') {
            this.emparejar("Digito");
        } else if(this.currentToken.description == 'Cadena') {
            this.emparejar("Cadena");
        } else if(this.currentToken.description == 'PR_null') {
            this.emparejar("PR_null");
        }
    }

    public otroCase() {
        if(this.currentToken != null) {
            if(this.currentToken.description == 'PR_case') {
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
            if(this.currentToken.description != null) {
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
            if(this.currentToken.description != null) {
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
            if(this.currentToken.description == 'PR_default') {
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
        if(this.currentToken.description == "Digito") {
            this.emparejar("Digito");
        } else if(this.currentToken.description == "Cadena") {
            this.emparejar("Cadena");
        //FALTA CARACTER
        } else if(this.currentToken.description == "Caracter") {
            this.emparejar("Caracter");
        } else if(this.currentToken.description == "PR_true") {
            this.emparejar("PR_true");
        } else if(this.currentToken.description == "PR_false") {
            this.emparejar("PR_false");
        } else if(this.currentToken.description == "Identificador") {
            this.emparejar("Identificador");
        }
    }

    public operacionRelacional() {
        if(this.currentToken.description == "TK_Menor") {
            this.emparejar("TK_Menor");
            this.traductor = this.traductor + "<";
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.traductor = this.traductor + "=";
                this.emparejar("TK_Igual");
            } else {
                //EPSILON
            }
        } else if(this.currentToken.description == "TK_Mayor") {
            this.emparejar("TK_Mayor");
            this.traductor = this.traductor + ">";
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.traductor = this.traductor + "=";
                this.emparejar("TK_Igual");
            } else {
                //EPSILON
            }
        } if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.emparejar("TK_Igual");
            this.traductor = this.traductor + "==";
        } if(this.currentToken.description == "TK_Exclamacion") {
            this.emparejar("TK_Exclamacion");
            this.emparejar("TK_Igual");
            this.traductor = this.traductor + "!=";
        } 
    }
    public operacionRelacionalFor() {
        if(this.currentToken.description == "TK_Menor") {
            this.emparejar("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
            } else {
                //EPSILON
            }
        } else if(this.currentToken.description == "TK_Mayor") {
            this.emparejar("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
            } else {
                //EPSILON
            }
        } 
    }
    public operacionLogicoAndOr() {
        if(this.currentToken.description == "TK_Pleca") {
            this.emparejar("TK_Pleca");
            this.emparejar("TK_Pleca");
        } else if(this.currentToken.description == "TK_&") {
            this.emparejar("TK_&");
            this.emparejar("TK_&");
        }
    }

    public operacionLogicoNot() {
        if(this.currentToken.description == "TK_Exclamacion") {
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
        this.condicion();
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
        this.emparejar("Identificador");
        this.emparejar("TK_Igual");
        this.traductor = this.traductor + "=";
        this.expresion();
        this.emparejar("TK_PuntoComa");
        this.InsertTraduction(this.traductor, "cadena");
        this.listaDeclaracion();
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
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        }
        else if (this.currentToken.lexema == "-")
        {
            this.traductor = this.traductor + "-";
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        }
        else if (this.currentToken.lexema == "|")
        {
            this.emparejar(this.currentToken.description);
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        }else if (this.currentToken.lexema == "&")
        {
            this.emparejar(this.currentToken.description);
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        } else
        if(this.currentToken.description == "TK_Menor") {
            this.emparejar("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.evaluarSiguiente(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Mayor") {
            this.emparejar("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.evaluarSiguiente(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.emparejar("TK_Igual");
            this.evaluarSiguiente(this.currentToken.description);
        } else if(this.currentToken.description == "TK_Exclamacion") {
            this.emparejar("TK_Exclamacion");
            this.emparejar("TK_Igual");
            this.evaluarSiguiente(this.currentToken.description);
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
            this.emparejar(this.currentToken.description);
            this.expresion();
            this.emparejar("TK_Parentesis_Der");
        }
        else if (this.currentToken.description == ("Digito") 
        || this.currentToken.description == ("Cadena")
        || this.currentToken.description == ("Decimal")
        || this.currentToken.description == ("Cadena_HTML")
        || this.currentToken.description == ("PR_true")
        || this.currentToken.description == ("PR_false"))
        {
            this.traductor = this.traductor +this.currentToken.getLexema(); 
            this.emparejar(this.currentToken.description);
        } else if (this.currentToken.description == ("Identificador"))
        {
            this.traductor = this.traductor +this.currentToken.getLexema(); 
            this.emparejar(this.currentToken.description);
            this.valorMetodoGlobal();
        } else {
            console.error("Error se esperaba Digito o Cadena en lugar de " + this.currentToken.description);
        }
    }

    public terminoPrima() {
        if (this.currentToken.lexema == "*")
        {
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        }
        else if (this.currentToken.lexema == "/")
        {
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
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
        if(this.currentToken.description == "TK_Coma") {
            this.emparejar("TK_Coma");
            this.listaParametroAsignacion();
        } else {
            //EPSILON
        }
    }
    

    public emparejar(token:string)
    {
        if(this.currentToken!=null){
            if (this.currentToken.getDescription()!=token)
            {
                //ERROR SI NO VIENE LO QUE DEBERIA
                console.error("Error se esperaba "+ token + " en lugar de " + this.currentToken.description);
                //RECUPERACION MODO PANICO
                for (let index = this.index; index < this.arrayListToken.length; index++) {
                    this.currentToken = this.arrayListToken[this.index];
                    if(this.currentToken.description == token) {
                        this.currentToken = this.arrayListToken[this.index];
                        break;
                    }
                    this.index += 1;
                }
            }
            //FLUJO CORRECTO
            if (this.currentToken.getDescription()==token)
            {
                this.index += 1;
                this.currentToken = this.arrayListToken[this.index];
            }
        }
    }


    public InsertTraduction( lexema: string, description: string ){
        if (lexema != "") {
            this.arrayTraducido.push( new TokenPyton(lexema, description) );
        }  
        this.traductor = "";
    }
    public ClearTraduction(){
        this.arrayTraducido = [];
        this.traductor = "";
    } 
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
                console.log(tabs + element.getLexema());
            }
        }
        return newElement;   
    }
}