import { Token } from '../models/Token';

export class SintacticoAnalizer {

    private static instance: SintacticoAnalizer;
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
    private contador:number = 0;
    private strError = "";

    constructor(){
    }

    public static getInstance(): SintacticoAnalizer {
        if (!SintacticoAnalizer.instance) {
            SintacticoAnalizer.instance = new SintacticoAnalizer();
        }
        return SintacticoAnalizer.instance;
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
                if(this.currentToken.description == 'PR_main') {
                    console.log("METODO PRINCIPAL")
                    this.declaracionComentario();
                    this.metodoPrincipal();
                    this.declaracionComentario();
                } else if(this.currentToken.description == 'Identificador') {
                    console.log("METODO VOID")
                    this.metodoVoid();
                }
            } else if(this.currentToken.description == "PR_int"
            || this.currentToken.description == "PR_double"
            || this.currentToken.description == "PR_char"
            || this.currentToken.description == "PR_bool"
            || this.currentToken.description == "PR_string"
            ) {
                this.declaracionComentario();
                this.tipoDeclaracion();
                this.declaracionComentario();
            }
        }
    }

    public tipoDeclaracion() {
        if(this.currentToken.description == "PR_int") {
            this.emparejar("PR_int");
            this.emparejar("Identificador");
            this.asignacionVariableGlobal();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.description == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.description == "TK_Coma") {
                this.listaAsignacionGlobal();
                this.emparejar("TK_PuntoComa");
            } else if(this.currentToken.description == "TK_PuntoComa") {
                this.emparejar("TK_PuntoComa");
            }
        } else if(this.currentToken.description == "PR_double") {
            this.emparejar("PR_double");
            this.emparejar("Identificador");
            this.asignacionVariableGlobal();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.description == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.description == "TK_Coma") {
                this.listaAsignacionGlobal();
                this.emparejar("TK_PuntoComa");
            } else if(this.currentToken.description == "TK_PuntoComa") {
                this.emparejar("TK_PuntoComa");
            }
        } else if(this.currentToken.description == "PR_char") {
            this.emparejar("PR_char");
            this.emparejar("Identificador");
            this.asignacionVariableGlobal();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.description == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.description == "TK_Coma") {
                this.listaAsignacionGlobal();
                this.emparejar("TK_PuntoComa");
            } else if(this.currentToken.description == "TK_PuntoComa") {
                this.emparejar("TK_PuntoComa");
            }
        } else if(this.currentToken.description == "PR_bool") {
            this.emparejar("PR_bool");
            this.emparejar("Identificador");
            this.asignacionVariableGlobal();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.description == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.description == "TK_Coma") {
                this.listaAsignacionGlobal();
                this.emparejar("TK_PuntoComa");
            } else if(this.currentToken.description == "TK_PuntoComa") {
                this.emparejar("TK_PuntoComa");
            }
        } else if(this.currentToken.description == "PR_string") {
            this.emparejar("PR_string");
            this.emparejar("Identificador");
            this.asignacionVariableGlobal();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.description == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.description == "TK_Coma") {
                this.listaAsignacionGlobal();
                this.emparejar("TK_PuntoComa");
            } else if(this.currentToken.description == "TK_PuntoComa") {
                this.emparejar("TK_PuntoComa");
            }
        }
    }

    public listaAsignacionGlobal() {
        this.masElementosGlobal();
    }

    public listaAsignacionGlobal2() {
        this.emparejar("Identificador");
        this.asignacionVariableGlobal();
        this.masElementosGlobal();
    }

    public masElementosGlobal() {
        if(this.currentToken.description == "TK_Coma") {
            this.emparejar("TK_Coma");
            this.listaAsignacionGlobal2();
        } else {
            //EPSILON
        }
    }

    public asignacionVariableGlobal() {
        if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
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
            }else if(this.currentToken.description == "PR_int"
            || this.currentToken.description == "PR_double"
            || this.currentToken.description == "PR_char"
            || this.currentToken.description == "PR_bool"
            || this.currentToken.description == "PR_string"
            ) {
                this.declaracion();
                this.otraDeclaracionGlobal();
            }
        }
    }

    public metodoPrincipal() {
        this.esMetodo = true;
        this.emparejar("PR_main");
        this.emparejar("TK_Parentesis_Izq");
        this.parametroPrincipal();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.esMetodo = false;
    }

    public metodoVoid() {
        this.esMetodo = true;
        this.emparejar("Identificador");
        this.emparejar("TK_Parentesis_Izq");
        this.declaracionParametros();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.esMetodo = false;
    }

    public parametroPrincipal() {
        if (this.currentToken.description == "PR_string")
        {
            this.emparejar("PR_string");
            this.emparejar("TK_Corchete_Izq");
            this.emparejar("TK_Corchete_Der");
            this.emparejar("Identificador");
        } else {
            //EPSILON
        }
    }

    public declaracionMetodo() {
        this.declaracionComentario();
        this.metodo();
        this.declaracionComentario();
        this.otroMetodo();
        this.declaracionComentario();
    }

    public metodo() {
        if(this.currentToken!=null) {
            if (this.currentToken.description == "PR_void")
            {
                this.emparejar("PR_void");
                this.emparejar("Identificador");
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("TK_LlaveDerecha");
            } else if (this.currentToken.description == "PR_int")
            {
                this.emparejar("PR_int");
                this.emparejar("Identificador");
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("PR_return");
                this.emparejar("Identificador");
                this.emparejar("TK_PuntoComa");
                this.emparejar("TK_LlaveDerecha");
            } else if (this.currentToken.description == "PR_double")
            {
                this.emparejar("PR_double");
                this.emparejar("Identificador");
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("PR_return");
                this.emparejar("Identificador");
                this.emparejar("TK_PuntoComa");
                this.emparejar("TK_LlaveDerecha");
            } else if (this.currentToken.description == "PR_char")
            {
                this.emparejar("PR_char");
                this.emparejar("Identificador");
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("PR_return");
                this.emparejar("Identificador");
                this.emparejar("TK_PuntoComa");
                this.emparejar("TK_LlaveDerecha");
            } else if (this.currentToken.description == "PR_bool")
            {
                this.emparejar("PR_bool");
                this.emparejar("Identificador");
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("PR_return");
                this.emparejar("Identificador");
                this.emparejar("TK_PuntoComa");
                this.emparejar("TK_LlaveDerecha");
            } else if (this.currentToken.description == "PR_string")
            {
                this.emparejar("PR_string");
                this.emparejar("Identificador");
                this.emparejar("TK_Parentesis_Izq");
                this.declaracionParametros();
                this.emparejar("TK_Parentesis_Der");
                this.emparejar("TK_LlaveIzquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.emparejar("PR_return");
                this.emparejar("Identificador");
                this.emparejar("TK_PuntoComa");
                this.emparejar("TK_LlaveDerecha");
            }
        }
    }

    public otroMetodo() {
        if(this.currentToken!=null) {
            if(this.currentToken.description == "PR_void" 
            || this.currentToken.description == "PR_int"
            || this.currentToken.description == "PR_double"
            || this.currentToken.description == "PR_char"
            || this.currentToken.description == "PR_bool"
            || this.currentToken.description == "PR_string"
            ) {
                this.declaracionComentario();
                this.metodo();
                this.declaracionComentario();
                this.otroMetodo();
                this.declaracionComentario();
            } else {
                //EPSILON
            }
        }
    }

    //DECLARACION PARAMETROS
    public declaracionParametros(){
        if(this.currentToken.description == "PR_int"
            || this.currentToken.description == "PR_double"
            || this.currentToken.description == "PR_char"
            || this.currentToken.description == "PR_bool"
            || this.currentToken.description == "PR_string"
            ) {
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }

    public listaParametro() {
        this.emparejar("Identificador");
        this.masParametros();
    }

    public masParametros() {
        if(this.currentToken.description == "TK_Coma") {
            this.emparejar("TK_Coma");
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }

    //DECLARACION COMENTARIO
    public declaracionComentario() {
        this.comentario();
        this.otrosComentarios();
    }

    comentario() {
        if(this.currentToken!=null) {
            if (this.currentToken.description == ("ComentarioLinea"))
            {
                this.emparejar("ComentarioLinea");
            } else if (this.currentToken.description == ("ComentarioMultilinea"))
            {
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

    //LISTA DECLARACION
    public listaDeclaracion() {
        if(this.currentToken != null) {
            if(this.currentToken.description == "PR_int"
            || this.currentToken.description == "PR_double"
            || this.currentToken.description == "PR_char"
            || this.currentToken.description == "PR_bool"
            || this.currentToken.description == "PR_string"
            ) {
                this.declaracionVariable();
            } else if (this.currentToken.description == ("ComentarioLinea")
            || this.currentToken.description == ("ComentarioMultilinea"))
            {
                this.declaracionComentario();
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
            } else if (this.currentToken.description == ("PR_console"))
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
            this.emparejar("PR_return");
            //TIPO DE RETORNO
            this.emparejar("TK_PuntoComa");
        } else if(this.esFuncion == true) {
            this.emparejar("PR_return");
            //TIPO DE RETORNO
            this.condicionesReturn();
            this.emparejar("TK_PuntoComa");
        }
        this.listaDeclaracion();
    }

    //DECLARACION CONSOLA
    public declaracionConsole() {
        this.emparejar("PR_console");
        this.emparejar("TK_Punto");
        this.emparejar("PR_write");
        this.emparejar("TK_Parentesis_Izq");
        this.expresion();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_PuntoComa");
        this.listaDeclaracion();
    }

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
    }

    public otraAsignacion() {
        if(this.currentToken != null) {
            if(this.currentToken.description == "PR_int"
            || this.currentToken.description == "PR_double"
            || this.currentToken.description == "PR_char"
            || this.currentToken.description == "PR_bool"
            || this.currentToken.description == "PR_string"
            ) {
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
        if(this.currentToken.description == "PR_int") {
            this.emparejar("PR_int");
        } else if(this.currentToken.description == "PR_double") {
            this.emparejar("PR_double");
        } else if(this.currentToken.description == "PR_char") {
            this.emparejar("PR_char");
        } else if(this.currentToken.description == "PR_bool") {
            this.emparejar("PR_bool");
        } else if(this.currentToken.description == "PR_string") {
            this.emparejar("PR_string");
        }
    }

    public listaAsignacion() {
        this.emparejar("Identificador");
        if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.expresion();
        } else {
            //EPSILON
        }
        this.masElementos();
    }

    public masElementos() {
        if(this.currentToken.description == "TK_Coma") {
            this.emparejar("TK_Coma");
            this.listaAsignacion();
        } else {
            //EPSILON
        }
    }

    public asignacionVariable() {
        if(this.currentToken.description!=null) {
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.expresion();
            } else {
                //EPSILON
            }
        }
    }

    //DECLARACION IF ELSEIF ELSE
    public DeclaracionIf() {
        this.emparejar("PR_if");
        this.emparejar("TK_Parentesis_Izq");
        this.condiciones();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
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

    public tipoCondicion() {
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

    public tipoElse() {
        if(this.currentToken.description == 'PR_if') {
            this.declaracionComentario();
            this.declaracionElseIf();
            this.declaracionComentario();
        } else if(this.currentToken.description == 'TK_LlaveIzquierda') {
            this.declaracionComentario();
            this.declaracionElse();
            this.declaracionComentario();
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
        this.emparejar("Identificador");
        this.emparejar("TK_Igual");
        this.emparejar(this.currentToken.getDescription());
        this.emparejar("TK_PuntoComa");
        //CONDICION
        this.condicion();
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
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public declaracionWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.emparejar("PR_while");
        this.emparejar("TK_Parentesis_Izq");
        //CONDICION
        this.condiciones();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
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
        this.emparejar("Identificador");
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.cuerpoSwitch();
        this.declaracionComentario();
        this.default();
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
                this.tipoCase()
                this.emparejar("TK_DosPuntos");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
            } else {
                //EPSILON
            }
        }
    }

    public tipoCase() {
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
                this.emparejar("TK_PuntoComa");
                this.listaDeclaracion();
            }
        }
    }

    public continue() {
        if(this.esRepeticion != 0) {
            if(this.currentToken.description != null) {
                this.emparejar("PR_continue");
                this.emparejar("TK_PuntoComa");
                this.listaDeclaracion();
            }
        }
    }

    public default() {
        if(this.currentToken != null) {
            if(this.currentToken.description == 'PR_default') {
                this.emparejar("PR_default");
                this.emparejar("TK_DosPuntos");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
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
        } if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.emparejar("TK_Igual");
        } if(this.currentToken.description == "TK_Exclamacion") {
            this.emparejar("TK_Exclamacion");
            this.emparejar("TK_Igual");
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
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.emparejar("PR_while");
        this.emparejar("TK_Parentesis_Izq");
        //CONDICION
        this.condiciones();
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
        this.emparejar("Identificador");
        this.emparejar("TK_Igual");
        this.expresion();
        this.emparejar("TK_PuntoComa");
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
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        }
        else if (this.currentToken.lexema == "-")
        {
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
        || this.currentToken.description == ("Caracter")
        || this.currentToken.description == ("PR_true")
        || this.currentToken.description == ("PR_false"))
        {
            this.emparejar(this.currentToken.description);
        } else if (this.currentToken.description == ("Identificador"))
        {
            this.emparejar(this.currentToken.description);
            this.valorMetodoGlobal();
        } else {
            console.error("*Error Sintactico: Se esperaba Digito o Cadena en lugar de " + this.currentToken.description);
            this.strError = this.strError + "\n" + "*Error Sintactico: Se esperaba Digito o Cadena en lugar de " + this.currentToken.description 
            + ", Linea: " +this.currentToken.getRow() + ", Columna: " + this.currentToken.getColum();
                
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
        }if(this.currentToken.description == "TK_&") {
            this.emparejar("TK_&");
            this.emparejar("TK_&");
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
            this.emparejar(this.currentToken.description);
            this.evaluarSiguiente2(this.currentToken.description);
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
                this.evaluarSiguiente2(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Mayor") {
            this.emparejar("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
                this.evaluarSiguiente2(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.emparejar("TK_Igual");
            this.evaluarSiguiente2(this.currentToken.description);
        } else if(this.currentToken.description == "TK_Exclamacion") {
            this.emparejar("TK_Exclamacion");
            this.emparejar("TK_Igual");
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
                console.error("*Error Sintactico: Se esperaba Digito o Cadena en lugar de " + this.currentToken.description);
                this.strError = this.strError + "\n" +
                "*Error Sintactico: Se esperaba Digito o Cadena en lugar de " + this.currentToken.description
                + ", Linea: " +this.currentToken.getRow() + ", Columna: " + this.currentToken.getColum();

            }
        }
    }

    public terminoPrima2() {
        if(this.currentToken.description!=null) {
            if (this.currentToken.lexema == "*")
            {
                this.emparejar(this.currentToken.description);
                this.evaluarSiguiente2(this.currentToken.description);
            }
            else if (this.currentToken.lexema == "/")
            {
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
        }if(this.currentToken.description == "TK_&") {
            this.emparejar("TK_&");
            this.emparejar("TK_&");
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
                //console.error("*Error Sintactico: Se esperaba Digito o Cadena en lugar de " + this.currentToken.description);
                this.strError = this.strError + "\n" +
                "*Error Sintactico: Se esperaba Digito o Cadena en lugar de " + this.currentToken.description
                + ", Linea: " +this.currentToken.getRow() + ", Columna: " + this.currentToken.getColum();
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
    
    public clear(){
        this.strError = "";
    }
    public GetError() : string {
        return this.strError;
    }
    public emparejar(token:string)
    {
        let validar:Boolean;
        if(this.currentToken!=null){
            if (this.currentToken.getDescription()!=token)
            {
                //ERROR SI NO VIENE LO QUE DEBERIA
                console.error("*Error Sintactico: Se esperaba "+ token + " en lugar de " + this.currentToken.description);
                this.strError = this.strError + "\n" + "*Error Sintactico: Se esperaba "+ token + " en lugar de " + this.currentToken.description
                + ", Linea: " +this.currentToken.getRow() + ", Columna: " + this.currentToken.getColum();
                //RECUPERACION MODO PANICO
                console.log(this.currentToken.description)

                for (let index = this.index; index < this.arrayListToken.length; index++) {
                    console.log(this.currentToken.description)

                    this.currentToken = this.arrayListToken[this.index];
                    if(this.currentToken.description == "TK_PuntoComa" 
                    || this.currentToken.description == "TK_LlaveDerecha"
                    || this.currentToken.description == "TK_LlaveIzquierda"
                    || this.currentToken.description == "PR_void"
                    || this.currentToken.description == "PR_int"
                    || this.currentToken.description == "PR_string"
                    || this.currentToken.description == "PR_double"
                    || this.currentToken.description == "PR_char"
                    || this.currentToken.description == "PR_bool") {
                        this.currentToken = this.arrayListToken[this.index];
                        validar = true;
                        break;
                    }
                    this.index += 1;
                }

                /*for (let index = this.index; index < this.arrayListToken.length; index++) {
                    console.log(this.currentToken.description)

                    this.currentToken = this.arrayListToken[this.index];
                    if(this.currentToken.description == "TK_PuntoComa" 
                    || this.currentToken.description == "TK_LlaveDerecha"
                    || this.currentToken.description == "TK_LlaveIzquierda"
                    || this.currentToken.description == "PR_void"
                    || this.currentToken.description == "PR_int"
                    || this.currentToken.description == "PR_string"
                    || this.currentToken.description == "PR_double"
                    || this.currentToken.description == "PR_char"
                    || this.currentToken.description == "PR_bool") {
                        console.log("COINCIDE", this.currentToken.description)
                        this.currentToken = this.arrayListToken[this.index];
                        validar = true;
                        break;
                    }
                    this.index += 1;
                }

                if(validar==false) {
                    for (let index = this.index; index < this.arrayListToken.length; index++) {

                        this.currentToken = this.arrayListToken[this.index];
                        if(this.currentToken.description == token) {
                            console.log("COINCIDE", this.currentToken.description)
    
                            this.currentToken = this.arrayListToken[this.index];
                            break;
                        }
                        this.index += 1;
                    }
                }*/
                
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
    
}