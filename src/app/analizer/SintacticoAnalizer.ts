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
        this.CommentDeclatarion();
        this.class();
        this.CommentDeclatarion();
    }

    //class Y METODO PRINCIPAL
    public class() {
        if(this.currentToken.getDescription() == "PR_public") {
            this.Parea("PR_public");
            this.Parea("PR_class");
            this.Parea("Identificador");
            this.Parea("TK_LlaveIzquierda");
            this.CommentDeclatarion();
            this.GlobalDeclaration();
            this.CommentDeclatarion();
            this.Parea("TK_LlaveDerecha");
        } else {
            this.Parea("PR_class");
            this.Parea("Identificador");
            this.Parea("TK_LlaveIzquierda");
            this.CommentDeclatarion();
            this.GlobalDeclaration();
            this.CommentDeclatarion();
            this.Parea("TK_LlaveDerecha");
        }
    }

    public GlobalDeclaration() {
        this.CommentDeclatarion();
        this.declaration();
        this.CommentDeclatarion();
        this.newGlobalDeclaration();
        this.CommentDeclatarion();
    }

    public declaration(){
        if(this.currentToken.getDescription()!=null) {
            if(this.currentToken.getDescription() == 'PR_void') {
                this.Parea("PR_void");
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.getDescription() == 'PR_main') {
                    console.log("METODO PRINCIPAL")
                    this.CommentDeclatarion();
                    this.MainMethod();
                    this.CommentDeclatarion();
                } else if(this.currentToken.getDescription() == 'Identificador') {
                    console.log("METODO VOID")
                    this.VoidMethod();
                }
            } else if(this.currentToken.getDescription() == "PR_int"
            || this.currentToken.getDescription() == "PR_double"
            || this.currentToken.getDescription() == "PR_char"
            || this.currentToken.getDescription() == "PR_bool"
            || this.currentToken.getDescription() == "PR_string"
            ) {
                this.CommentDeclatarion();
                this.tipodeclaration();
                this.CommentDeclatarion();
            }
        }
    }

    public tipodeclaration() {
        if(this.currentToken.getDescription() == "PR_int") {
            this.Parea("PR_int");
            this.Parea("Identificador");
            this.asignateGlobalVariable();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.getDescription() == "TK_Coma") {
                this.GlobalAsignationList();
                this.Parea("TK_PuntoComa");
            } else if(this.currentToken.getDescription() == "TK_PuntoComa") {
                this.Parea("TK_PuntoComa");
            }
        } else if(this.currentToken.getDescription() == "PR_double") {
            this.Parea("PR_double");
            this.Parea("Identificador");
            this.asignateGlobalVariable();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.getDescription() == "TK_Coma") {
                this.GlobalAsignationList();
                this.Parea("TK_PuntoComa");
            } else if(this.currentToken.getDescription() == "TK_PuntoComa") {
                this.Parea("TK_PuntoComa");
            }
        } else if(this.currentToken.getDescription() == "PR_char") {
            this.Parea("PR_char");
            this.Parea("Identificador");
            this.asignateGlobalVariable();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.getDescription() == "TK_Coma") {
                this.GlobalAsignationList();
                this.Parea("TK_PuntoComa");
            } else if(this.currentToken.getDescription() == "TK_PuntoComa") {
                this.Parea("TK_PuntoComa");
            }
        } else if(this.currentToken.getDescription() == "PR_bool") {
            this.Parea("PR_bool");
            this.Parea("Identificador");
            this.asignateGlobalVariable();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.getDescription() == "TK_Coma") {
                this.GlobalAsignationList();
                this.Parea("TK_PuntoComa");
            } else if(this.currentToken.getDescription() == "TK_PuntoComa") {
                this.Parea("TK_PuntoComa");
            }
        } else if(this.currentToken.getDescription() == "PR_string") {
            this.Parea("PR_string");
            this.Parea("Identificador");
            this.asignateGlobalVariable();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("TK_LlaveDerecha");
                this.esFuncion = false;
            } else if(this.currentToken.getDescription() == "TK_Coma") {
                this.GlobalAsignationList();
                this.Parea("TK_PuntoComa");
            } else if(this.currentToken.getDescription() == "TK_PuntoComa") {
                this.Parea("TK_PuntoComa");
            }
        }
    }

    public GlobalAsignationList() {
        this.moreGlobalElements();
    }

    public GlobalAsignationList2() {
        this.Parea("Identificador");
        this.asignateGlobalVariable();
        this.moreGlobalElements();
    }

    public moreGlobalElements() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.Parea("TK_Coma");
            this.GlobalAsignationList2();
        } else {
            //EPSILON
        }
    }

    public asignateGlobalVariable() {
        if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.expresion();
        } else {
            //EPSILON
        }
    }

    public valorVariableGlobal() {
        if(this.currentToken.getDescription() == "Digito") {
            this.Parea("Digito");
        } else if(this.currentToken.getDescription() == "Cadena") {
            this.Parea("Cadena");
        //FALTA CARACTER
        } else if(this.currentToken.getDescription() == "Caracter") {
            this.Parea("Caracter");
        } else if(this.currentToken.getDescription() == "PR_true") {
            this.Parea("PR_true");
        } else if(this.currentToken.getDescription() == "PR_false") {
            this.Parea("PR_false");
        } else if(this.currentToken.getDescription() == "Identificador") {
            this.Parea("Identificador");
            this.valorMetodoGlobal();
        }
    }

    public valorMetodoGlobal() {
        if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
            this.Parea("TK_Parentesis_Izq");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Parentesis_Der") {
                this.Parea("TK_Parentesis_Der");
            } else {
                //LISTADO DE ASIGNACIONES
                this.listaParametroAsignacion();
                this.Parea("TK_Parentesis_Der");
            }
            
        } else {
            //EPSILON
        }
    }

    public newGlobalDeclaration(){
        if(this.currentToken.getDescription()!=null) {
            if(this.currentToken.getDescription() == 'PR_void') {
                this.declaration();
                this.newGlobalDeclaration();
            }else if(this.currentToken.getDescription() == "PR_int"
            || this.currentToken.getDescription() == "PR_double"
            || this.currentToken.getDescription() == "PR_char"
            || this.currentToken.getDescription() == "PR_bool"
            || this.currentToken.getDescription() == "PR_string"
            ) {
                this.declaration();
                this.newGlobalDeclaration();
            }
        }
    }

    public MainMethod() {
        this.esMetodo = true;
        this.Parea("PR_main");
        this.Parea("TK_Parentesis_Izq");
        this.MainParameters();
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
        this.Parea("TK_LlaveDerecha");
        this.esMetodo = false;
    }

    public VoidMethod() {
        this.esMetodo = true;
        this.Parea("Identificador");
        this.Parea("TK_Parentesis_Izq");
        this.ParametersDeclaration();
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
        this.Parea("TK_LlaveDerecha");
        this.esMetodo = false;
    }

    public MainParameters() {
        if (this.currentToken.getDescription() == "PR_string")
        {
            this.Parea("PR_string");
            this.Parea("TK_Corchete_Izq");
            this.Parea("TK_Corchete_Der");
            this.Parea("Identificador");
        } else {
            //EPSILON
        }
    }

    public declarationMetodo() {
        this.CommentDeclatarion();
        this.metodo();
        this.CommentDeclatarion();
        this.otroMetodo();
        this.CommentDeclatarion();
    }

    public metodo() {
        if(this.currentToken!=null) {
            if (this.currentToken.getDescription() == "PR_void")
            {
                this.Parea("PR_void");
                this.Parea("Identificador");
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("TK_LlaveDerecha");
            } else if (this.currentToken.getDescription() == "PR_int")
            {
                this.Parea("PR_int");
                this.Parea("Identificador");
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("PR_return");
                this.Parea("Identificador");
                this.Parea("TK_PuntoComa");
                this.Parea("TK_LlaveDerecha");
            } else if (this.currentToken.getDescription() == "PR_double")
            {
                this.Parea("PR_double");
                this.Parea("Identificador");
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("PR_return");
                this.Parea("Identificador");
                this.Parea("TK_PuntoComa");
                this.Parea("TK_LlaveDerecha");
            } else if (this.currentToken.getDescription() == "PR_char")
            {
                this.Parea("PR_char");
                this.Parea("Identificador");
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("PR_return");
                this.Parea("Identificador");
                this.Parea("TK_PuntoComa");
                this.Parea("TK_LlaveDerecha");
            } else if (this.currentToken.getDescription() == "PR_bool")
            {
                this.Parea("PR_bool");
                this.Parea("Identificador");
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("PR_return");
                this.Parea("Identificador");
                this.Parea("TK_PuntoComa");
                this.Parea("TK_LlaveDerecha");
            } else if (this.currentToken.getDescription() == "PR_string")
            {
                this.Parea("PR_string");
                this.Parea("Identificador");
                this.Parea("TK_Parentesis_Izq");
                this.ParametersDeclaration();
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
                this.Parea("PR_return");
                this.Parea("Identificador");
                this.Parea("TK_PuntoComa");
                this.Parea("TK_LlaveDerecha");
            }
        }
    }

    public otroMetodo() {
        if(this.currentToken!=null) {
            if(this.currentToken.getDescription() == "PR_void" 
            || this.currentToken.getDescription() == "PR_int"
            || this.currentToken.getDescription() == "PR_double"
            || this.currentToken.getDescription() == "PR_char"
            || this.currentToken.getDescription() == "PR_bool"
            || this.currentToken.getDescription() == "PR_string"
            ) {
                this.CommentDeclatarion();
                this.metodo();
                this.CommentDeclatarion();
                this.otroMetodo();
                this.CommentDeclatarion();
            } else {
                //EPSILON
            }
        }
    }

    //declaration PARAMETROS
    public ParametersDeclaration(){
        if(this.currentToken.getDescription() == "PR_int"
            || this.currentToken.getDescription() == "PR_double"
            || this.currentToken.getDescription() == "PR_char"
            || this.currentToken.getDescription() == "PR_bool"
            || this.currentToken.getDescription() == "PR_string"
            ) {
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }

    public listaParametro() {
        this.Parea("Identificador");
        this.masParametros();
    }

    public masParametros() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.Parea("TK_Coma");
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }

    //declaration COMENTARIO
    public CommentDeclatarion() {
        this.comentario();
        this.otrosComentarios();
    }

    comentario() {
        if(this.currentToken!=null) {
            if (this.currentToken.getDescription() == ("ComentarioLinea"))
            {
                this.Parea("ComentarioLinea");
            } else if (this.currentToken.getDescription() == ("ComentarioMultilinea"))
            {
                this.Parea("ComentarioMultilinea");
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

    //LISTA declaration
    public DeclarationList() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == "PR_int"
            || this.currentToken.getDescription() == "PR_double"
            || this.currentToken.getDescription() == "PR_char"
            || this.currentToken.getDescription() == "PR_bool"
            || this.currentToken.getDescription() == "PR_string"
            ) {
                this.declarationVariable();
            } else if (this.currentToken.getDescription() == ("ComentarioLinea")
            || this.currentToken.getDescription() == ("ComentarioMultilinea"))
            {
                this.CommentDeclatarion();
            } else if (this.currentToken.getDescription() == ("PR_if"))
            {
                this.declarationIf();
            } else if (this.currentToken.getDescription() == ("PR_for"))
            {
                this.declarationFor();
            } else if (this.currentToken.getDescription() == ("PR_while"))
            {
                this.declarationWhile();
            } else if (this.currentToken.getDescription() == ("PR_switch"))
            {
                this.declarationSwitch();
            } else if (this.currentToken.getDescription() == ("PR_do"))
            {
                this.declarationDoWhile();
            } else if (this.currentToken.getDescription() == ("PR_console"))
            {
                this.declarationConsole();
            } else if (this.currentToken.getDescription() == ("Identificador"))
            {
                this.declarationSinTipo();
            } else if (this.currentToken.getDescription() == ("PR_return"))
            {
                this.declarationRetorno();
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

    public declarationRetorno() {
        if(this.esMetodo == true) {
            this.Parea("PR_return");
            //TIPO DE RETORNO
            this.Parea("TK_PuntoComa");
        } else if(this.esFuncion == true) {
            this.Parea("PR_return");
            //TIPO DE RETORNO
            this.condicionesReturn();
            this.Parea("TK_PuntoComa");
        }
        this.DeclarationList();
    }

    //declaration CONSOLA
    public declarationConsole() {
        this.Parea("PR_console");
        this.Parea("TK_Punto");
        this.Parea("PR_write");
        this.Parea("TK_Parentesis_Izq");
        this.expresion();
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_PuntoComa");
        this.DeclarationList();
    }

    //declaration VARIABLE
    public declarationVariable() {
        this.CommentDeclatarion();
        this.asignacion();
        this.CommentDeclatarion();
        this.otraAsignacion();
        this.CommentDeclatarion();
        this.DeclarationList();
    }

    public asignacion() {
        this.tipoVariable();
        this.listaAsignacion();
        this.asignacionVariable();
        this.Parea("TK_PuntoComa");
    }

    public otraAsignacion() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == "PR_int"
            || this.currentToken.getDescription() == "PR_double"
            || this.currentToken.getDescription() == "PR_char"
            || this.currentToken.getDescription() == "PR_bool"
            || this.currentToken.getDescription() == "PR_string"
            ) {
                this.CommentDeclatarion();
                this.asignacion();
                this.CommentDeclatarion();
                this.otraAsignacion();
                this.CommentDeclatarion();
                this.DeclarationList();
            }
        } else {
            //EPSILON
        }
    }

    public tipoVariable() {
        if(this.currentToken.getDescription() == "PR_int") {
            this.Parea("PR_int");
        } else if(this.currentToken.getDescription() == "PR_double") {
            this.Parea("PR_double");
        } else if(this.currentToken.getDescription() == "PR_char") {
            this.Parea("PR_char");
        } else if(this.currentToken.getDescription() == "PR_bool") {
            this.Parea("PR_bool");
        } else if(this.currentToken.getDescription() == "PR_string") {
            this.Parea("PR_string");
        }
    }

    public listaAsignacion() {
        this.Parea("Identificador");
        if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.expresion();
        } else {
            //EPSILON
        }
        this.masElementos();
    }

    public masElementos() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.Parea("TK_Coma");
            this.listaAsignacion();
        } else {
            //EPSILON
        }
    }

    public asignacionVariable() {
        if(this.currentToken.getDescription()!=null) {
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
                this.expresion();
            } else {
                //EPSILON
            }
        }
    }

    //declaration IF ELSEIF ELSE
    public declarationIf() {
        this.Parea("PR_if");
        this.Parea("TK_Parentesis_Izq");
        this.condiciones();
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
        this.Parea("TK_LlaveDerecha");
        this.CommentDeclatarion();
        this.else();
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
    }

    //CONDICION IF
    public condicion() {
        this.tipoCondicion();
        this.operacionRelacional();
        this.tipoCondicion();
    }

    public tipoCondicion() {
        if(this.currentToken.getDescription() == 'Identificador') {
            this.Parea("Identificador");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.Parea("Cadena");
        } else if(this.currentToken.getDescription() == 'Digito') {
            this.Parea("Digito");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.Parea("Cadena");
        } else if(this.currentToken.getDescription() == 'PR_null') {
            this.Parea("PR_null");
        } else if(this.currentToken.getDescription() == 'PR_true') {
            this.Parea("PR_true");
        } else if(this.currentToken.getDescription() == 'PR_false') {
            this.Parea("PR_false");
        } else if(this.currentToken.getDescription() == 'Decimal') {
            this.Parea("Decimal");
        }
    }

    public else() {
        if(this.currentToken.getDescription() == 'PR_else') {
            this.Parea("PR_else");
            this.tipoElse();
        } else {
            //EPSILON
        }
    }

    public tipoElse() {
        if(this.currentToken.getDescription() == 'PR_if') {
            this.CommentDeclatarion();
            this.declarationElseIf();
            this.CommentDeclatarion();
        } else if(this.currentToken.getDescription() == 'TK_LlaveIzquierda') {
            this.CommentDeclatarion();
            this.declarationElse();
            this.CommentDeclatarion();
        }
    }

    public declarationElseIf() {
        this.CommentDeclatarion();
        this.elseIf();
        this.CommentDeclatarion();
        this.otroElseIf();
        this.CommentDeclatarion();
    }

    public elseIf() {
        if(this.currentToken.getDescription() == 'PR_if') {
            this.Parea("PR_if");
            this.Parea("TK_Parentesis_Izq");
            this.condicion();
            this.Parea("TK_Parentesis_Der");
            this.Parea("TK_LlaveIzquierda");
            this.CommentDeclatarion();
            this.DeclarationList();
            this.CommentDeclatarion();
            this.Parea("TK_LlaveDerecha");
        } else {
            //EPSILON
        }
    }

    public otroElseIf() {
        if(this.currentToken.getDescription() == 'PR_else') {
            this.CommentDeclatarion();
            this.else()
            this.CommentDeclatarion();
            this.elseIf();
            this.CommentDeclatarion();
            this.otroElseIf();
            this.CommentDeclatarion();
        } else {
            //EPSILON
        }
    }

    public declarationElse() {
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
        this.Parea("TK_LlaveDerecha");
    }

    public declarationFor() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.Parea("PR_for");
        this.Parea("TK_Parentesis_Izq");
        //INICIALIZACION
        this.Parea("PR_int");
        this.Parea("Identificador");
        this.Parea("TK_Igual");
        this.Parea(this.currentToken.getDescription());
        this.Parea("TK_PuntoComa");
        //CONDICION
        this.condicion();
        this.Parea("TK_PuntoComa");
        //INCREMENTO
        this.Parea("Identificador");
        if(this.currentToken.getDescription() == 'TK_Suma') {
            this.Parea("TK_Suma");
            this.Parea("TK_Suma");
        } else if(this.currentToken.getDescription() == 'TK_Resta') {
            this.Parea("TK_Resta");
            this.Parea("TK_Resta");
        }
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
        this.Parea("TK_LlaveDerecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
    }

    public declarationWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.Parea("PR_while");
        this.Parea("TK_Parentesis_Izq");
        //CONDICION
        this.condiciones();
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
        this.Parea("TK_LlaveDerecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
    }

    public declarationSwitch() {
        this.esSwitchRepeticion++;
        this.Parea("PR_switch");
        this.Parea("TK_Parentesis_Izq");
        this.Parea("Identificador");
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclatarion();
        this.cuerpoSwitch();
        this.CommentDeclatarion();
        this.default();
        this.CommentDeclatarion();
        this.Parea("TK_LlaveDerecha");
        this.esSwitchRepeticion--;
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
    }

    public cuerpoSwitch() {
        this.CommentDeclatarion();
        this.case();
        this.CommentDeclatarion();
        this.otroCase();
        this.CommentDeclatarion();
    }

    public case() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == 'PR_case') {
                this.Parea("PR_case");
                this.tipoCase()
                this.Parea("TK_DosPuntos");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
            } else {
                //EPSILON
            }
        }
    }

    public tipoCase() {
        if(this.currentToken.getDescription() == 'Identificador') {
            this.Parea("Identificador");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.Parea("Cadena");
        } else if(this.currentToken.getDescription() == 'Digito') {
            this.Parea("Digito");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.Parea("Cadena");
        } else if(this.currentToken.getDescription() == 'PR_null') {
            this.Parea("PR_null");
        }
    }

    public otroCase() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == 'PR_case') {
                this.CommentDeclatarion();
                this.case();
                this.CommentDeclatarion();
                this.otroCase();
                this.CommentDeclatarion();
            } else {
                //EPSILON
            }
        }
    }

    public break() {
        if(this.esSwitchRepeticion != 0) {
            if(this.currentToken.getDescription() != null) {
                this.Parea("PR_break");
                this.Parea("TK_PuntoComa");
                this.DeclarationList();
            }
        }
    }

    public continue() {
        if(this.esRepeticion != 0) {
            if(this.currentToken.getDescription() != null) {
                this.Parea("PR_continue");
                this.Parea("TK_PuntoComa");
                this.DeclarationList();
            }
        }
    }

    public default() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == 'PR_default') {
                this.Parea("PR_default");
                this.Parea("TK_DosPuntos");
                this.CommentDeclatarion();
                this.DeclarationList();
                this.CommentDeclatarion();
            } else {
                //EPSILON
            }
        }
    }


    public valorVariable() {
        if(this.currentToken.getDescription() == "Digito") {
            this.Parea("Digito");
        } else if(this.currentToken.getDescription() == "Cadena") {
            this.Parea("Cadena");
        //FALTA CARACTER
        } else if(this.currentToken.getDescription() == "Caracter") {
            this.Parea("Caracter");
        } else if(this.currentToken.getDescription() == "PR_true") {
            this.Parea("PR_true");
        } else if(this.currentToken.getDescription() == "PR_false") {
            this.Parea("PR_false");
        } else if(this.currentToken.getDescription() == "Identificador") {
            this.Parea("Identificador");
        }
    }

    public operacionRelacional() {
        if(this.currentToken.getDescription() == "TK_Menor") {
            this.Parea("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
            } else {
                //EPSILON
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.Parea("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
            } else {
                //EPSILON
            }
        } if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.Parea("TK_Igual");
        } if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
            this.Parea("TK_Igual");
        } 
    }

    public operacionLogicoAndOr() {
        if(this.currentToken.getDescription() == "TK_Pleca") {
            this.Parea("TK_Pleca");
            this.Parea("TK_Pleca");
        } else if(this.currentToken.getDescription() == "TK_&") {
            this.Parea("TK_&");
            this.Parea("TK_&");
        }
    }

    public operacionLogicoNot() {
        if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
        }
    }

    public declarationDoWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.Parea("PR_do");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
        this.Parea("TK_LlaveDerecha");
        this.Parea("PR_while");
        this.Parea("TK_Parentesis_Izq");
        //CONDICION
        this.condiciones();
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_PuntoComa");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
    }

    //declaration SIN TIPO
    public declarationSinTipo() {
        this.Parea("Identificador");
        this.Parea("TK_Igual");
        this.expresion();
        this.Parea("TK_PuntoComa");
        this.CommentDeclatarion();
        this.DeclarationList();
        this.CommentDeclatarion();
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
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "-")
        {
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "|")
        {
            this.Parea(this.currentToken.getDescription());
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }else if (this.currentToken.lexema == "&")
        {
            this.Parea(this.currentToken.getDescription());
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        } else
        if(this.currentToken.getDescription() == "TK_Menor") {
            this.Parea("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.Parea("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.Parea("TK_Igual");
            this.evaluarSiguiente(this.currentToken.getDescription());
        } else if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
            this.Parea("TK_Igual");
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
            this.Parea(this.currentToken.getDescription());
            this.expresion();
            this.Parea("TK_Parentesis_Der");
        }
        else if (this.currentToken.getDescription() == ("Digito") 
        || this.currentToken.getDescription() == ("Cadena")
        || this.currentToken.getDescription() == ("Decimal")
        || this.currentToken.getDescription() == ("Cadena_HTML")
        || this.currentToken.getDescription() == ("Caracter")
        || this.currentToken.getDescription() == ("PR_true")
        || this.currentToken.getDescription() == ("PR_false"))
        {
            this.Parea(this.currentToken.getDescription());
        } else if (this.currentToken.getDescription() == ("Identificador"))
        {
            this.Parea(this.currentToken.getDescription());
            this.valorMetodoGlobal();
        } else {
            this.strError = this.strError + "\n" + "*Error Sintactico: Se esperaba Digito o Cadena en lugar de '" + this.currentToken.getLexema() 
            + "' , Linea: " +this.currentToken.getRow() + ", Columna: " + this.currentToken.getColum();
                
        }
    }

    public terminoPrima() {
        if (this.currentToken.lexema == "*")
        {
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "/")
        {
            this.Parea(this.currentToken.getDescription());
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
            this.Parea("TK_Coma");
            this.listaParametroAsignacion();
        } else {
            //EPSILON
        }
    }

    /*_______________________________________________NUEVAS CONDICIONES____________________________________________ */
    public condiciones() {
        if(this.currentToken.getDescription() != "TK_Parentesis_Der") {
            this.expresion2();
            this.masCondiciones();
        }
    }

    public masCondiciones() {
        if(this.currentToken.getDescription() == "TK_Pleca") {
            this.Parea("TK_Pleca");
            this.Parea("TK_Pleca");
        }if(this.currentToken.getDescription() == "TK_&") {
            this.Parea("TK_&");
            this.Parea("TK_&");
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
        if (this.currentToken.getDescription() != null)
        {
        if (this.currentToken.lexema == "+")
        {
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente2(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "-")
        {
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }else if(this.currentToken.getDescription() == "TK_Menor") {
            this.Parea("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente2(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.Parea("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente2(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.Parea("TK_Igual");
            this.evaluarSiguiente2(this.currentToken.getDescription());
        } else if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
            this.Parea("TK_Igual");
            this.evaluarSiguiente2(this.currentToken.getDescription());
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
        if(this.currentToken.getDescription()!=null) {
            if (this.currentToken.lexema == "(")
            {
                this.Parea(this.currentToken.getDescription());
                this.expresion2();
                this.Parea("TK_Parentesis_Der");
            }
            else if (this.currentToken.getDescription() == ("Digito") 
            || this.currentToken.getDescription() == ("Cadena")
            || this.currentToken.getDescription() == ("Decimal")
            || this.currentToken.getDescription() == ("Cadena_HTML")
            || this.currentToken.getDescription() == ("Caracter")
            || this.currentToken.getDescription() == ("PR_true")
            || this.currentToken.getDescription() == ("PR_false"))
            {
                this.Parea(this.currentToken.getDescription());
            } else if (this.currentToken.getDescription() == ("Identificador"))
            {
                this.Parea(this.currentToken.getDescription());
            } else if (this.currentToken.getDescription() == ("TK_Exclamacion"))
            {
                this.Parea("TK_Exclamacion");
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.getDescription() == "Identificador") {
                    this.Parea("Identificador");
                } else if(this.currentToken.getDescription() == "PR_true" || this.currentToken.getDescription() == "PR_false") {
                    this.Parea(this.currentToken.getDescription());
                }
            } else {
               this.strError = this.strError + "\n" +
                "*Error Sintactico: Se esperaba Digito o Cadena en lugar de '" + this.currentToken.getLexema()
                + "', Linea: " +this.currentToken.getRow() + ", Columna: " + this.currentToken.getColum();

            }
        }
    }

    public terminoPrima2() {
        if(this.currentToken.getDescription()!=null) {
            if (this.currentToken.lexema == "*")
            {
                this.Parea(this.currentToken.getDescription());
                this.evaluarSiguiente2(this.currentToken.getDescription());
            }
            else if (this.currentToken.lexema == "/")
            {
                this.Parea(this.currentToken.getDescription());
                this.evaluarSiguiente2(this.currentToken.getDescription());
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
        if(this.currentToken.getDescription() != "TK_PuntoComa") {
            this.expresion2();
            this.masCondicione3();
        }
    }

    public masCondicione3() {
        if(this.currentToken.getDescription() == "TK_Pleca") {
            this.Parea("TK_Pleca");
            this.Parea("TK_Pleca");
        }if(this.currentToken.getDescription() == "TK_&") {
            this.Parea("TK_&");
            this.Parea("TK_&");
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
        if (this.currentToken.getDescription() != null)
        {
        if (this.currentToken.lexema == "+")
        {
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente3(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "-")
        {
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }else if(this.currentToken.getDescription() == "TK_Menor") {
            this.Parea("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente3(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente3(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.Parea("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente3(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente3(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.Parea("TK_Igual");
            this.evaluarSiguiente3(this.currentToken.getDescription());
        } else if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
            this.Parea("TK_Igual");
            this.evaluarSiguiente3(this.currentToken.getDescription());
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
        if(this.currentToken.getDescription()!=null) {
            if (this.currentToken.lexema == "(")
            {
                this.Parea(this.currentToken.getDescription());
                this.expresion3();
                this.Parea("TK_Parentesis_Der");
            }
            else if (this.currentToken.getDescription() == ("Digito") 
            || this.currentToken.getDescription() == ("Cadena")
            || this.currentToken.getDescription() == ("Decimal")
            || this.currentToken.getDescription() == ("Cadena_HTML")
            || this.currentToken.getDescription() == ("Caracter")
            || this.currentToken.getDescription() == ("PR_true")
            || this.currentToken.getDescription() == ("PR_false"))
            {
                this.Parea(this.currentToken.getDescription());
            } else if (this.currentToken.getDescription() == ("Identificador"))
            {
                this.Parea(this.currentToken.getDescription());
            } else if (this.currentToken.getDescription() == ("TK_Exclamacion"))
            {
                this.Parea("TK_Exclamacion");
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.getDescription() == "Identificador") {
                    this.Parea("Identificador");
                } else if(this.currentToken.getDescription() == "PR_true" || this.currentToken.getDescription() == "PR_false") {
                    this.Parea(this.currentToken.getDescription());
                }
            } else {
                //console.error("*Error Sintactico: Se esperaba Digito o Cadena en lugar de " + this.currentToken.getDescription());
                this.strError = this.strError + "\n" +
                "*Error Sintactico: Se esperaba Digito o Cadena en lugar de '" + this.currentToken.getLexema();
                + "', Linea: " +this.currentToken.getRow() + ", Columna: " + this.currentToken.getColum();
            }
        }
    }

    public terminoPrima3() {
        if(this.currentToken.getDescription()!=null) {
            if (this.currentToken.lexema == "*")
            {
                this.Parea(this.currentToken.getDescription());
                this.evaluarSiguiente3(this.currentToken.getDescription());
            }
            else if (this.currentToken.lexema == "/")
            {
                this.Parea(this.currentToken.getDescription());
                this.evaluarSiguiente3(this.currentToken.getDescription());
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
    public Parea(token:string)
    {
        let validar:Boolean;
        if(this.currentToken!=null){
            if (this.currentToken.getDescription()!=token)
            {
                //ERROR SI NO VIENE LO QUE DEBERIA
                this.strError = this.strError + "\n" + "*Error Sintactico: Se esperaba '"+ token.replace("TK_", "") + "' en lugar de '" + this.currentToken.getLexema() + "', Linea: " +this.currentToken.getRow() + ", Columna: " + this.currentToken.getColum();
                //RECUPERACION MODO PANICO
                console.log(this.currentToken.getDescription())

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
                        validar = true;
                        break;
                    }
                    this.index += 1;
                }

                /*for (let index = this.index; index < this.arrayListToken.length; index++) {
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
                        console.log("COINCIDE", this.currentToken.getDescription())
                        this.currentToken = this.arrayListToken[this.index];
                        validar = true;
                        break;
                    }
                    this.index += 1;
                }

                if(validar==false) {
                    for (let index = this.index; index < this.arrayListToken.length; index++) {

                        this.currentToken = this.arrayListToken[this.index];
                        if(this.currentToken.getDescription() == token) {
                            console.log("COINCIDE", this.currentToken.getDescription())
    
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