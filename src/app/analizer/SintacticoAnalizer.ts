import { Token } from '../models/Token';

export class SintacticoAnalizer {

    private static instance: SintacticoAnalizer;
    private arrayListToken: Token[] = [];
    private index:number = 0;
    private currentToken:Token = null;
    private tokenInicio:String = "";
    private errorSintactico:boolean = false;

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
        this.emparejar("PR_public");
        this.emparejar("PR_class");
        this.emparejar("Identificador");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.metodoPrincipal();
        this.declaracionComentario();
        this.declaracionMetodo();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
    }

    public metodoPrincipal() {
        this.emparejar("PR_static");
        this.emparejar("PR_void");
        this.emparejar("PR_Main");
        this.emparejar("TK_Parentesis_Izq");
        this.parametroPrincipal();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
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
            } else {
                //EPSILON
            }
        }
    }

    //DECLARACION VARIABLE
    public declaracionVariable() {
        this.declaracionComentario();
        this.asignacion();
        this.declaracionComentario();
        this.otraAsignacion();
        this.declaracionComentario();
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
        if(this.currentToken.description == "TK_Igual") {
            this.emparejar("TK_Igual");
            this.valorVariable();
        } else {
            //EPSILON
        }
    }

    //DECLARACION IF ELSEIF ELSE
    public DeclaracionIf() {
        this.emparejar("PR_if");
        this.emparejar("TK_Parentesis_Izq");
        this.condicion();
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
        this.emparejar("PR_for");
        this.emparejar("TK_Parentesis_Izq");
        //INICIALIZACION
        this.emparejar("TK_PuntoComa");
        //CONDICION
        this.emparejar("TK_PuntoComa");
        //INCREMENTO
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public declaracionWhile() {
        this.emparejar("PR_while");
        this.emparejar("TK_Parentesis_Izq");
        //CONDICION
        this.condicion();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public declaracionSwitch() {
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
                this.break();
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
        if(this.currentToken != null) {
            if(this.currentToken.description == 'PR_break') {
                this.emparejar("PR_break");
                this.emparejar("TK_PuntoComa");
            } else {
                //EPSILON
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
                this.emparejar("PR_break");
                this.emparejar("TK_PuntoComa");
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
            if(this.currentToken.description == "TK_Igual") {
                this.emparejar("TK_Igual");
            } else {
                //EPSILON
            }
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
        this.emparejar("PR_do");
        this.emparejar("TK_LlaveIzquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.emparejar("TK_LlaveDerecha");
        this.emparejar("PR_while");
        this.emparejar("TK_Parentesis_Izq");
        //CONDICION
        this.condicion();
        this.emparejar("TK_Parentesis_Der");
        this.emparejar("TK_PuntoComa");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public emparejar(token:string)
    {
        if(this.currentToken!=null){
            if (this.currentToken.getDescription()!=token)
            {
                //ERROR SI NO VIENE LO QUE DEBERIA
                console.error("Error se esperaba "+ token + " en lugar de " + this.currentToken.description);
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